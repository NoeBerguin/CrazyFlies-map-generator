import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { HeaderComponent } from './components/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApplicationComponent } from './components/application/application.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from './components/map/map.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { VideosComponent } from './components/videos/videos.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NewMissionDialogComponent } from './components/application/dialogNewMission/new-mission-dialog/new-mission-dialog.component';
import { HistoryDialogComponent } from './components/application/dialogHistory/history-dialog/history-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LogComponent } from './components/logs/log.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BatteryLevelComponent } from './components/battery-level/battery-level.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DroneInfoComponent } from './components/application/drone-info/drone-info.component';
import { RouterModule } from '@angular/router';
import { PersonComponent } from './components/home/person/person.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ApplicationComponent,
    ErrorComponent,
    MapComponent,
    VideosComponent,
    NewMissionDialogComponent,
    HistoryDialogComponent,
    LogComponent,
    BatteryLevelComponent,
    DroneInfoComponent,
    PersonComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSliderModule,
    MatExpansionModule,
    MatGridListModule,
    MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
