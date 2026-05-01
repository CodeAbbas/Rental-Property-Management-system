import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnalyticsComponent } from './analytics';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [
        {
          provide: ApiService,
          useValue: {
            getAvgRent: () => of([]),
            getPopularTypes: () => of([])
          }
        },
        {
          provide: AuthService,
          useValue: {
            getToken: () => 'test-token'
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have analytics data', () => {
    expect(component.averageRent).toBeDefined();
    expect(component.popularTypes).toBeDefined();
  });
});
