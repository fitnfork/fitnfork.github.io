import { Component, HostListener, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'fnf-header',
  templateUrl: './header.component.html',
  imports: [CommonModule],
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  scrollProgress = 0;

  // parámetros (ajústalos)
  private initialTitle = 64; // px (tamaño del título en hero)
  private minTitle = 20; // px (tamaño del título en navbar)
  private minLogo = 56; // px (tamaño del logo cuando aparece en navbar)
  showLogoThreshold = 0.6; // aparece logo pequeño a partir de aquí
  shrunkThreshold = 0.95; // consideramos "completamente shrink" a partir de aquí
  private finalHeaderHeight = 70; // px (altura final del header cuando shrink)

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    this.updateAll();
    setTimeout(() => this.updateAll(), 250);
  }

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onWindowChange() {
    this.updateAll();
  }

  private updateAll() {
    this.updateScrollProgress();
    this.updateHeroHeightVariable();
  }

  private updateScrollProgress() {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    this.scrollProgress = Math.min(Math.max(scrollY / window.innerHeight, 0), 1);
  }

  private updateHeroHeightVariable() {
    const headerEl = this.el.nativeElement.querySelector('.fnf-header') as HTMLElement;
    const height = headerEl ? headerEl.offsetHeight : window.innerHeight;
    document.documentElement.style.setProperty('--hero-height', `${height}px`);
  }

  get showSmallLogo(): boolean {
    return this.scrollProgress >= this.showLogoThreshold;
  }
  get isShrunk(): boolean {
    return this.scrollProgress >= this.shrunkThreshold;
  }

  get titleSize(): number {
    return Math.round(
      this.initialTitle + (this.minTitle - this.initialTitle) * this.scrollProgress
    );
  }

  get titleOpacity(): number {
    return Math.max(0, 1 - this.scrollProgress * 1.6);
  }

  get logoWidth(): number {
    return this.showSmallLogo ? this.minLogo : 0;
  }

  get logoOpacity(): number {
    return this.showSmallLogo ? 1 : 0;
  }

  get headerHeightPx(): number {
    return Math.round(
      window.innerHeight - (window.innerHeight - this.finalHeaderHeight) * this.scrollProgress
    );
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
