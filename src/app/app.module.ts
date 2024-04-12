import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AppComponent} from './app.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {SiteHeaderComponent} from './components/site-header/site-header.component';
import {SiteFooterComponent} from './components/site-footer/site-footer.component';
import {AlbumsComponent} from './pages/albums/albums.component';
import {ContactsComponent} from './pages/contacts/contacts.component';
import {CollectionsComponent} from './pages/collections/collections.component';
import {ContactFormComponent} from './components/contact-form/contact-form.component';
import {RandomAlbumsComponent} from './components/random-albums/random-albums.component';
import {ModalComponent} from './components/modal/modal.component';
import {AuthComponent} from './components/auth/auth.component';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {FormsModule} from '@angular/forms';
import { DndModule } from 'ngx-drag-drop';
import {InteractiveAlbumComponent} from './components/interactive-album/interactive-album.component';
import {AlbumPreviewComponent} from './components/album-preview/album-preview.component';
import {AlbumSingleComponent} from './pages/album-single/album-single.component';
import {ScrollToModule} from 'ng2-scroll-to';
import {FinishRegistrationComponent} from './pages/finish-registration/finish-registration.component';
import {CreateGroupComponent} from './components/create-group/create-group.component';
import {HelpComponent} from './pages/help/help.component';
import {AuthService} from './services/auth/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {ConfirmRegistrationComponent} from './pages/confirm-registration/confirm-registration.component';
import {EmailVerificationComponent} from './pages/email-verification/email-verification.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from 'src/environments/environment';
import {UsersListComponent} from './admin/users-list/users-list.component';
import {AlbumsListComponent} from './admin/albums-list/albums-list.component';
import {NewAlbumComponent} from './admin/new-album/new-album.component';
import {QuestionsComponent} from './admin/questions/questions.component';
import {AddImagesComponent} from './admin/add-images/add-images.component';
import {ToastMessageComponent} from './components/toast-message/toast-message.component';
import {LoaderComponent} from './components/loader/loader.component';
import {DropZoneDirective} from './directives/drop-zone.directive';
import {FileSizePipe} from './pipes/file-size.pipe';
import {ImageListComponent} from './admin/image-list/image-list.component';
import {ClickDirective} from './directives/click.directive';
import {ImgPreloaderDirective} from './directives/img-preloader.directive';
import {TableModule} from 'primeng/table';

import {AgGridModule} from 'ag-grid-angular';
import {ManageImagesComponent} from './admin/manage-images/manage-images.component';
import {CardRendererComponent} from './admin/manage-images/card-renderer.component';
import {QuestionsListComponent} from './admin/questions-list/questions-list.component';
import {LevelComponent} from './admin/configuration/levels/level/level.component';
import {LevelListComponent} from './admin/configuration/levels/level-list/level-list.component';
import {LanguageComponent} from './admin/configuration/languages/language/language.component';
import {LanguageListComponent} from './admin/configuration/languages/language-list/language-list.component';
import {CollectionComponent} from './admin/configuration/collections/collection/collection.component';
import {CollectionListComponent} from './admin/configuration/collections/collection-list/collection-list.component';
import {ConfigurationComponent} from './admin/configuration/configuration/configuration.component';
import {CheckboxComponent} from './admin/checkbox/checkbox.component';
import {MyGroupsComponent} from './components/my-groups/my-groups.component';
import {ItemComponent} from './components/item/item.component';
import {ItemInfoComponent} from './components/item-info/item-info.component';
import {TriviaFirstComponent} from './components/trivia-first/trivia-first.component';
import {TriviaSecondComponent} from './components/trivia-second/trivia-second.component';
import {TriviaThirdComponent} from './components/trivia-third/trivia-third.component';
import {CardsExchangeComponent} from './pages/cards-exchange/cards-exchange.component';
import {ExchangeProposalComponent} from './pages/exchange-proposal/exchange-proposal.component';
import {RankingComponent} from './pages/ranking/ranking.component';
import {AlbumOverviewComponent} from './pages/album-overview/album-overview.component';
import {CardComponent} from './components/card/card.component';
import {AlbumSubscriptionComponent} from './components/album-subscription/album-subscription.component';
import {AlbumSingleOpenComponent} from './pages/album-single-open/album-single-open.component';
import { CardsDirective } from './directives/cards.directive';
import { UserService } from './services/user/user.service';
import { ThemeComponent } from './admin/configuration/themes/theme/theme.component';
import { ThemeListComponent } from './admin/configuration/themes/theme-list/theme-list.component';
import { JoinGroupComponent } from './components/join-group/join-group.component';
import { RankingUserComponent } from './components/ranking-user/ranking-user.component';
import { ProposalModalComponent } from './components/proposal-modal/proposal-modal.component';
import { FaqComponent } from './pages/faq/faq.component';
import { TemarioComponent } from './components/temario/temario.component';

const appRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'collections', component: CollectionsComponent},
  {path: 'albums', component: AlbumsComponent},
  {path: 'album/:id', component: AlbumSingleComponent},
  {path: 'album/:id/opened', component: AlbumSingleOpenComponent},
  {path: 'cards-exchange/:groupUid/:albumUid/:type/:proposalId', component: CardsExchangeComponent},
  {path: 'exchange-proposal', component: ExchangeProposalComponent},
  {path: 'album-overview/:groupUid/:albumUid', component: AlbumOverviewComponent},
  {path: 'ranking/:id', component: RankingComponent},
  {path: 'registration-success', component: FinishRegistrationComponent},
  {path: 'confirm-registration', component: ConfirmRegistrationComponent},
  {path: 'verification', component: EmailVerificationComponent},
  {path: 'help', component: HelpComponent},
  {path: 'admin-albums', component: NewAlbumComponent},
  {path: 'admin-users', component: UsersListComponent},
  {path: 'admin-questions', component: QuestionsComponent},
  {path: 'admin-add-image', component: AddImagesComponent},
  {path: 'admin-manage-image', component: ManageImagesComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'faq', component: FaqComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AlbumsComponent,
    PageNotFoundComponent,
    ContactsComponent,
    CollectionsComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    ContactFormComponent,
    RandomAlbumsComponent,
    ModalComponent,
    AuthComponent,
    InteractiveAlbumComponent,
    AlbumPreviewComponent,
    AlbumSingleComponent,
    FinishRegistrationComponent,
    CreateGroupComponent,
    HelpComponent,
    ConfirmRegistrationComponent,
    EmailVerificationComponent,
    UsersListComponent,
    AlbumsListComponent,
    NewAlbumComponent,
    QuestionsComponent,
    AddImagesComponent,
    ToastMessageComponent,
    LoaderComponent,
    TemarioComponent,
    DropZoneDirective,
    FileSizePipe,
    ImageListComponent,
    ClickDirective,
    ImgPreloaderDirective,
    ManageImagesComponent,
    CardRendererComponent,
    QuestionsListComponent,
    LevelComponent,
    LevelListComponent,
    ThemeComponent,
    ThemeListComponent,
    LanguageComponent,
    LanguageListComponent,
    CollectionComponent,
    CollectionListComponent,
    ConfigurationComponent,
    CheckboxComponent,
    MyGroupsComponent,
    ItemComponent,
    RankingUserComponent,
    ItemInfoComponent,
    TriviaFirstComponent,
    TriviaSecondComponent,
    TriviaThirdComponent,
    CardsExchangeComponent,
    FaqComponent,
    ExchangeProposalComponent,
    RankingComponent,
    AlbumOverviewComponent,
    CardComponent,
    AlbumSubscriptionComponent,
    AlbumSingleOpenComponent,
    CardsDirective,
    JoinGroupComponent,
    ProposalModalComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {scrollPositionRestoration: 'enabled'} // <-- debugging purposes only //enableTracing: true,
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule,
    DndModule,
    ScrollToModule.forRoot(),
    HttpClientModule,
    AngularFireStorageModule,
    TableModule,
    AgGridModule.withComponents([CardRendererComponent]),
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (pp: UserService) => () => pp.init(),
      deps: [UserService],
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
