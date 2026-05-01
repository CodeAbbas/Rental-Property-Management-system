import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ListingsComponent } from './listings';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

describe('ListingsComponent', () => {
  let component: ListingsComponent;
  let fixture: ComponentFixture<ListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsComponent],
      providers: [
        {
          provide: ApiService,
          useValue: {
            getListings: () => of([]),
            addFavorite: () => of({}),
            searchListings: () => of([]),
            updateListing: () => of({}),
            deleteListing: () => of({})
          }
        },
        {
          provide: AuthService,
          useValue: {
            getToken: () => 'test-token',
            isLoggedIn: () => true
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have listings array', () => {
    expect(component.listings).toBeDefined();
  });

  it('should have edit listing data', () => {
    expect(component.editListingData).toBeDefined();
  });
});
