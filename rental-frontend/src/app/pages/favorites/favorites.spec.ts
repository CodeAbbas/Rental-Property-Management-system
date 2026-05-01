import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FavoritesComponent } from './favorites';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        {
          provide: ApiService,
          useValue: {
            getFavorites: () => of({ favorites: [] }),
            getListing: () => of({})
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

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have favorites data', () => {
    expect(component.favorites).toBeDefined();
  });
});
