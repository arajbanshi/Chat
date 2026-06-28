import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatApp } from './chat-app';

describe('ChatApp', () => {
  let component: ChatApp;
  let fixture: ComponentFixture<ChatApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatApp],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatApp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
