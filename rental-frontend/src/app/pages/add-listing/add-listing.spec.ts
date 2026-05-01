import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AddListingComponent } from './add-listing';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

describe('AddListingComponent', () => {
  let component: AddListingComponent;
  let fixture: ComponentFixture<AddListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListingComponent],
      providers: [
        {
          provide: ApiService,
          useValue: {
            addListing: () => of({})
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

    fixture = TestBed.createComponent(AddListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
