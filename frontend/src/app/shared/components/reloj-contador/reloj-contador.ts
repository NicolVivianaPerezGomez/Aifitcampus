import { Component, effect, input, output, viewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';

@Component({
  imports: [CountdownComponent],
  selector: 'app-reloj-contador',
  styleUrl: './reloj-contador.css',
  templateUrl: './reloj-contador.html',
  host: {
    '[class.reloj--compacto]': 'compacto()',
  },
})
export class RelojContador {
  /** Segundos iniciales del ejercicio actual. */
  segundos = input(30);
  isPaused = input(false);
  /** Variante tipográfica embebida (sin círculo grande). */
  compacto = input(false);
  timeOut = output<void>();

  readonly cd = viewChild<CountdownComponent>('countdown');

  config: CountdownConfig = {
    leftTime: 30,
    format: 'mm:ss',
  };

  constructor() {
    effect(() => {
      const secs = this.segundos();
      this.config = { leftTime: secs, format: 'mm:ss' };
      queueMicrotask(() => {
        const instance = this.cd();
        if (!instance) return;
        instance.restart();
        if (this.isPaused()) {
          instance.pause();
        }
      });
    });

    effect(() => {
      const instance = this.cd();
      if (!instance) return;
      if (this.isPaused()) {
        instance.pause();
      } else {
        instance.resume();
      }
    });
  }

  handleEvent(e: CountdownEvent): void {
    if (e.action === 'done') {
      this.timeOut.emit();
    }
  }
}
