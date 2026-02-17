import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './ia.component.html',
  styleUrl: './ia.component.scss'
})
export class IaComponent {
  freeText = signal('');
  responses = signal<string[]>([]);

  generateTask(): void {
    const text = this.freeText().trim();
    if (!text) return;
    // Mock: parse simple rules
    const task = {
      title: text.length > 50 ? text.slice(0, 50) + '...' : text,
      priority: text.toLowerCase().includes('urgente') ? 'Alta' : 'Media',
      status: 'Pendiente'
    };
    this.responses.update((r) => [
      ...r,
      `[Mock] Tarea generada: "${task.title}" - Prioridad: ${task.priority} - Estado: ${task.status}`
    ]);
    this.freeText.set('');
  }

  quickQuery(type: string): void {
    const messages: Record<string, string> = {
      vencidas: 'Tienes 3 tareas vencidas. [Ver filtro Vencidas](/tareas?filtro=vencidas)',
      'por-vencer': 'Tienes 5 tareas por vencer en las próximas 72h. [Ver Tareas](/tareas)',
      carga: 'Top responsables: María García (6), Carlos López (5), Ana Martínez (4). [Ver Tablero](/tablero)'
    };
    this.responses.update((r) => [...r, `[Mock] ${messages[type] ?? 'Consulta no disponible'}`]);
  }
}
