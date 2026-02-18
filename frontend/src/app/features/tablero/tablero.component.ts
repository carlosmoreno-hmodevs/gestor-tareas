import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { TaskService } from '../../core/services/task.service';
import { DataService } from '../../core/services/data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    PageHeaderComponent,
    BaseChartDirective
  ],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.scss'
})
export class TableroComponent {
  private readonly taskService = inject(TaskService);
  private readonly dataService = inject(DataService);

  selectedPeriod = signal('7');
  users = this.dataService.usersForCurrentOrg;

  getUserByName(name: string) {
    return this.users().find((u) => u.name === name);
  }

  activeCount = this.taskService.activeCount;
  overdueCount = this.taskService.overdueCount;
  dueSoonCount = this.taskService.dueSoonCount;
  completedCount = this.taskService.completedCount;

  totalTasks = computed(
    () =>
      this.activeCount() + this.overdueCount() + this.dueSoonCount() + this.completedCount()
  );

  overdueAltaCount = computed(() =>
    this.taskService
      .tasks()
      .filter((t) => t.riskIndicator === 'vencida' && t.priority === 'Alta').length
  );

  loadByAssignee = computed(() => {
    const tasks = this.taskService.tasks();
    const map = new Map<string, number>();
    for (const t of tasks) {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) continue;
      const key = t.assignee || 'Sin asignar';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  });

  loadByPriority = computed(() => {
    const tasks = this.taskService.tasks();
    const map = new Map<string, number>();
    for (const t of tasks) {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) continue;
      map.set(t.priority, (map.get(t.priority) ?? 0) + 1);
    }
    const arr = Array.from(map.entries());
    const order = ['Alta', 'Media', 'Baja'];
    arr.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    return arr;
  });

  trendByDay = computed(() => {
    const days = 7;
    const now = new Date();
    const labels: string[] = [];
    const completadas: number[] = [];
    const pendientes: number[] = [];
    const vencidas: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      labels.push(d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' }));

      const tasks = this.taskService.tasks();
      let comp = 0;
      let pend = 0;
      let venc = 0;
      for (const t of tasks) {
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        if (due.getTime() !== d.getTime()) continue;
        if (['Completada', 'Liberada'].includes(t.status)) comp++;
        else if (t.riskIndicator === 'vencida') venc++;
        else pend++;
      }
      completadas.push(comp);
      pendientes.push(pend);
      vencidas.push(venc);
    }
    return { labels, completadas, pendientes, vencidas };
  });

  doughnutChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: ['Pendientes', 'Por vencer', 'Vencidas', 'Completadas'],
    datasets: [
      {
        data: [
          this.activeCount(),
          this.dueSoonCount(),
          this.overdueCount(),
          this.completedCount()
        ],
        backgroundColor: ['#1976d2', '#ed6c02', '#d32f2f', '#2e7d32'],
        hoverBackgroundColor: ['#42a5f5', '#ff9800', '#ef5350', '#66bb6a'],
        borderWidth: 0
      }
    ]
  }));

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true }
      }
    }
  };

  barAssigneeChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const load = this.loadByAssignee();
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          label: 'Tareas asignadas',
          data: load.map((x) => x[1]),
          backgroundColor: 'rgba(25, 118, 210, 0.8)',
          borderRadius: 6
        }
      ]
    };
  });

  barAssigneeChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.x} tarea(s)`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y: {
        grid: { display: false }
      }
    }
  };

  barPriorityChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const load = this.loadByPriority();
    const colors = ['#d32f2f', '#ed6c02', '#2e7d32'];
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          label: 'Tareas',
          data: load.map((x) => x[1]),
          backgroundColor: load.map((_, i) => colors[i] ?? '#757575'),
          borderRadius: 6
        }
      ]
    };
  });

  barPriorityChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} tarea(s)`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  lineTrendChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const t = this.trendByDay();
    return {
      labels: t.labels,
      datasets: [
        {
          label: 'Completadas',
          data: t.completadas,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Pendientes',
          data: t.pendientes,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Vencidas',
          data: t.vencidas,
          borderColor: '#d32f2f',
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  });

  lineTrendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 12, usePointStyle: true }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      }
    }
  };

  radarChartData = computed<ChartConfiguration<'radar'>['data']>(() => {
    const load = this.loadByAssignee();
    const max = Math.max(1, ...load.map((x) => x[1]));
    return {
      labels: load.map((x) => x[0].split(' ')[0]),
      datasets: [
        {
          label: 'Carga de trabajo',
          data: load.map((x) => x[1]),
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          borderColor: '#1976d2',
          pointBackgroundColor: '#1976d2',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#1976d2'
        }
      ]
    };
  });

  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.r} tarea(s)`
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  polarAreaChartData = computed<ChartConfiguration<'polarArea'>['data']>(() => {
    const load = this.loadByPriority();
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          data: load.map((x) => x[1]),
          backgroundColor: [
            'rgba(211, 47, 47, 0.7)',
            'rgba(237, 108, 2, 0.7)',
            'rgba(46, 125, 50, 0.7)'
          ],
          hoverBackgroundColor: ['#d32f2f', '#ed6c02', '#2e7d32']
        }
      ]
    };
  });

  polarAreaChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 12, usePointStyle: true }
      }
    },
    scales: {
      r: {
        display: false
      }
    }
  };
}
