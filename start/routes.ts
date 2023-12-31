/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return ("<div style=' height:100vh; flex:1; display:flex;  justify-content:center;font-size:15pt; align-items:center; '><div style='text-align:center;color:orange'> API Service Application Ver.2.0<br><span >Copyright &copy by Ujang Selamat</span> </div></div>")
})


Route.get("sliders", "HalamanDepan/SlidersController.publish")
Route.get("berita-kabupaten","HalamanDepan/BeritasController.index")
Route.get("show-latest-video","HalamanDepan/VideosController.showLatestVideo")
Route.get("show-video","HalamanDepan/VideosController.showVideos")

Route.group(()=>{
  Route.group(()=>{
    Route.post("token","Auth/LoginController.login")
    Route.post('registrasi-perusahaan',"Auth/RegistrasiPerusahaansController.registrasi")
    Route.post('registrasi-user', "Auth/RegisterUsersController.registrasi")
  }).prefix("auth")

  Route.get("info","AppsController.index")
  Route.get("menus","AppsController.menus").middleware('auth')
  Route.get("user-info","Utility/UsersController.userInfo").middleware(['auth'])

  //route media
  Route.post("media", "MediaController.store").middleware(["auth"]);
  Route.get("dashboard","DashboardController.index").middleware(['auth'])

  /** Route Group Super Admin */
  Route.group(()=>{
    Route.group(()=>{
      Route.resource("app-info","MasterData/AppInfosController")
      Route.resource("paket","MasterData/PaketsController")
      Route.resource('pengaturan',"MasterData/PengaturansController")
      Route.post("pengaturan-register","MasterData/PengaturansController.register")
    }).prefix("master-data").middleware(['auth'])
  }).prefix("superadmin")

  /**
   * Master Data Non Superadmin
   */
  Route.group(()=>{
    Route.resource("contact","MasterData/ContactsController")
  }).prefix("master-data").middleware(['auth'])

  //route data combo
  Route.group(()=>{
    Route.get("pengaturan","MasterData/PengaturansController.combo")
    Route.get("contact",'MasterData/ContactsController.combo')
  }).prefix('combo').middleware('auth')

  //route utility
  Route.group(()=>{
    //Route manajemen pengguna
    Route.resource("users","Utility/UsersController")
    Route.post("update-profil","Utility/UsersController.updateProfil")
    Route.post("change-pwd","Utility/UsersController.changePwd")

    //Route manajemen fitur administrator
    Route.resource("fiturs","Utility/FitursController")
    Route.post("fiturs-set-progress","Utility/FitursController.setprogress")
    Route.post("fiturs-set-selesai","Utility/FitursController.setselesai")

    //Route manajemen fitur userr
    Route.resource("manajemen-fiturs","Utility/FiturUsersController")

    //Route Update History
    Route.resource("updates","Utility/UpdateHistoriesController")

  }).prefix('utility').middleware(['auth'])

  /**
   * Group Route Halaman Depan
   */
  Route.group(()=>{
    Route.resource("sliders","HalamanDepan/SlidersController")
    Route.resource('videos',"HalamanDepan/VideosController")
  }).prefix("halaman-depan").middleware(['auth'])

  /**
   * Route Pesan
   */
  Route.group(()=>{
    Route.resource('outbox',"Pesan/OutboxesController")
    Route.post("outbox-bulk-delete","Pesan/OutboxesController.bulkDestroy")

  }).prefix("pesan").middleware(['auth'])


  /**
   * Route Group Mobile Service
   */
  Route.group(()=>{
    Route.get("sliders","Mobiles/SlidersController.index")
  }).prefix("mobiles").middleware(['auth'])

  Route.group(()=>{
    /**
     * Production
     */
    Route.post("send-message","Api/SendMessagesController.sendMessage")
    Route.post("send-bulk-message","Api/SendMessagesController.sendBulkMessage")

    /**
     * Send Box
     */
    Route.group(()=>{
      Route.post("send-message","Api/SendMessagesController.sendMessageSendBox")
    Route.post("send-bulk-message","Api/SendMessagesController.sendBulkMessageSendBox")
    }).prefix("send-box")
  }).prefix('v2')




}).prefix("api")

