Currently the app is being hosted here: <a href="https://nsbs-mern-frontend.vercel.app/" target="_blank">North Shore Bike Shop Website</a>


This is a website for North Shore Bike Shop (NSBS), a mountain bicycle store based in North Vancouver, BC.  This website allows customers to access information about the store, as well as the bikes that are in stock and availiable to order.

The website allows authenticated employees to log into an admin page where they can manage inventory of the bikes.  Employees can add all of the details of individual bikes and upload images so that customers can see what is in stock.  This admin page is hosted on the front end and accessible only through a secret password.

The website uses React for the frontend, with Material UI and Styled Components.  The rest of the app is powered by the MERN stack, using MongoDB Atlas.  It also uses cloudinary for image uploading.  Cloudinary allows images to be stored in the database only by the name of the image, and all data send and recieved to Cloudinary is done from the frontend.  This allows for smaller transcations between the front end and the back end.   

This app can scale easily to a full inventory management system that doesn't include just bikes, but all parts that are sold at the bike shop.  It is also only one step away from being able to process payments and get shipping details if the store decides to sell products online.

```
NSBS-MERN
├─ .DS_Store
├─ README.md
├─ client
│  ├─ .DS_Store
│  ├─ README.md
│  ├─ build
│  │  ├─ .DS_Store
│  │  ├─ IMG_1045 copy.png
│  │  ├─ IMG_1045.jpg
│  │  ├─ IMG_1090.jpg
│  │  ├─ asset-manifest.json
│  │  ├─ bikes.jpg
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo.png
│  │  ├─ logos2
│  │  │  ├─ .DS_Store
│  │  │  ├─ bell.jpg
│  │  │  ├─ camelbak.jpg
│  │  │  ├─ cush.jpg
│  │  │  ├─ endura.jpg
│  │  │  ├─ evoc.jpg
│  │  │  ├─ fox.jpg
│  │  │  ├─ giro.jpg
│  │  │  ├─ ixs.jpg
│  │  │  ├─ maxxis.jpg
│  │  │  ├─ oneup.jpg
│  │  │  ├─ rc.jpg
│  │  │  ├─ rockshox.jpg
│  │  │  ├─ shimano.jpg
│  │  │  ├─ sram.jpg
│  │  │  ├─ stans.jpg
│  │  │  ├─ tairin.jpg
│  │  │  ├─ tld.jpg
│  │  │  └─ wr1.jpg
│  │  ├─ lucas2.png
│  │  ├─ norc.png
│  │  ├─ norcologowhite.png
│  │  ├─ norcoriding.png
│  │  ├─ nsbsparts.jpg
│  │  ├─ pinkbike.png
│  │  ├─ service-stretch.jpg
│  │  ├─ service-xstretch.jpg
│  │  ├─ static
│  │  │  └─ js
│  │  │     ├─ main.14dbd19b.js
│  │  │     ├─ main.14dbd19b.js.LICENSE.txt
│  │  │     └─ main.14dbd19b.js.map
│  │  ├─ transitionlogowhite.png
│  │  ├─ transitionriding copy.jpg
│  │  ├─ transitionriding.jpg
│  │  ├─ transitionridingflat.jpg
│  │  ├─ trees-edit.png
│  │  ├─ trees-short.png
│  │  └─ trees.png
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ .DS_Store
│  │  ├─ 2-Norco-BC-min.png
│  │  ├─ 2-Norco-BC.png
│  │  ├─ IMG_1045 copy-min.png
│  │  ├─ IMG_1090-min.jpg
│  │  ├─ IMG_1090.jpg
│  │  ├─ Ibis_Logo_Wordmark_600px_WHT copy.png
│  │  ├─ bikes-min.jpg
│  │  ├─ demoday.jpg
│  │  ├─ favicon-black.ico
│  │  ├─ favicon.ico
│  │  ├─ gracey1.jpg
│  │  ├─ gracey2-min.jpg
│  │  ├─ gracey2.jpg
│  │  ├─ hannahb-min.jpg
│  │  ├─ hannahb.jpg
│  │  ├─ hd6.jpg
│  │  ├─ ibisann-min.jpg
│  │  ├─ ibisann.jpg
│  │  ├─ ibislogo.png
│  │  ├─ ibisriding.jpeg
│  │  ├─ index.html
│  │  ├─ logo-min.png
│  │  ├─ logo.png
│  │  ├─ logobird.png
│  │  ├─ logos2
│  │  │  ├─ .DS_Store
│  │  │  ├─ bell.jpg
│  │  │  ├─ camelbak.jpg
│  │  │  ├─ cush.jpg
│  │  │  ├─ endura.jpg
│  │  │  ├─ evoc.jpg
│  │  │  ├─ fox.jpg
│  │  │  ├─ giro.jpg
│  │  │  ├─ ixs.jpg
│  │  │  ├─ maxxis.jpg
│  │  │  ├─ oneup.jpg
│  │  │  ├─ rc.jpg
│  │  │  ├─ rockshox.jpg
│  │  │  ├─ shimano.jpg
│  │  │  ├─ sram.jpg
│  │  │  ├─ stans.jpg
│  │  │  ├─ tairin.jpg
│  │  │  ├─ tld.jpg
│  │  │  └─ wr1.jpg
│  │  ├─ logowhite.png
│  │  ├─ logowhitehq.png
│  │  ├─ lucas2-min.png
│  │  ├─ mattb-min.jpg
│  │  ├─ mattb.jpg
│  │  ├─ norc-min.png
│  │  ├─ norc.png
│  │  ├─ norco.svg
│  │  ├─ norcologowhite-min.png
│  │  ├─ norcoriding-min.png
│  │  ├─ nsbsparts-min.jpg
│  │  ├─ pinkbike-min.png
│  │  ├─ pinkbike.png
│  │  ├─ ripmohome.jpeg
│  │  ├─ sentinel.jpg
│  │  ├─ service-stretch-min.jpg
│  │  ├─ service-xstretch-min.jpg
│  │  ├─ sight160.jpg
│  │  ├─ sight160riding.webp
│  │  ├─ sightgen4.jpg
│  │  ├─ transitionann-min (1).jpg
│  │  ├─ transitionann-min.jpg
│  │  ├─ transitionann.jpg
│  │  ├─ transitionlogowhite.png
│  │  ├─ transitionriding copy-min.jpg
│  │  ├─ transitionriding-min.jpg
│  │  ├─ transitionridingflat-min.jpg
│  │  ├─ trees-edit-min.png
│  │  └─ trees-short-min.png
│  ├─ src
│  │  ├─ App.js
│  │  ├─ components
│  │  │  ├─ AdminActions
│  │  │  │  ├─ AddBike.jsx
│  │  │  │  ├─ AddImage.jsx
│  │  │  │  ├─ AddNewBike.jsx
│  │  │  │  ├─ AddSizes.jsx
│  │  │  │  ├─ AdminBikes.jsx
│  │  │  │  ├─ AdminImages.jsx
│  │  │  │  ├─ EditAvailability.jsx
│  │  │  │  ├─ EditBikeAvailability.jsx
│  │  │  │  ├─ EditBikeBrand.jsx
│  │  │  │  ├─ EditBikeColors.jsx
│  │  │  │  ├─ EditBikeDetail.jsx
│  │  │  │  ├─ EditBikeMaterial.jsx
│  │  │  │  ├─ EditBikeName.jsx
│  │  │  │  ├─ EditBikePrice.jsx
│  │  │  │  ├─ EditBikeSalePrice.jsx
│  │  │  │  ├─ EditBikeSizes.jsx
│  │  │  │  ├─ EditBikeType.jsx
│  │  │  │  ├─ EditSizes.jsx
│  │  │  │  ├─ EditSizesAvailiable.jsx
│  │  │  │  ├─ EditSizesInStock.jsx
│  │  │  │  └─ SelectImages.jsx
│  │  │  ├─ AdminLogin
│  │  │  │  ├─ PasswordForm.jsx
│  │  │  │  ├─ ProtectedRoute.jsx
│  │  │  │  └─ auth.jsx
│  │  │  ├─ AuthProvider.js
│  │  │  ├─ ContactPage
│  │  │  │  ├─ ContactContent.jsx
│  │  │  │  ├─ ContactForm.jsx
│  │  │  │  ├─ ContactPage.jsx
│  │  │  │  ├─ FormDescription.jsx
│  │  │  │  ├─ HoursTable.jsx
│  │  │  │  └─ Map.jsx
│  │  │  ├─ General
│  │  │  │  ├─ Closer.jsx
│  │  │  │  ├─ FadeInSection.jsx
│  │  │  │  ├─ NavBar.jsx
│  │  │  │  ├─ NavBarShop.jsx
│  │  │  │  ├─ ScrollToTop.jsx
│  │  │  │  └─ styles.css
│  │  │  ├─ HomePage
│  │  │  │  ├─ AboutUs.jsx
│  │  │  │  ├─ Announcements
│  │  │  │  │  ├─ Announcement.jsx
│  │  │  │  │  ├─ Sight160.jsx
│  │  │  │  │  └─ TransitionAnnouncement.jsx
│  │  │  │  ├─ Announcements.jsx
│  │  │  │  ├─ Bikes.jsx
│  │  │  │  ├─ DemoDay.jsx
│  │  │  │  ├─ HeaderImage.jsx
│  │  │  │  ├─ IbisHome.jsx
│  │  │  │  ├─ NSBSInfo.jsx
│  │  │  │  ├─ NorcoHome.jsx
│  │  │  │  ├─ Parts.jsx
│  │  │  │  ├─ Service.jsx
│  │  │  │  ├─ TransitionHome.jsx
│  │  │  │  └─ ZigZag.jsx
│  │  │  ├─ ServicePage
│  │  │  │  └─ ServiceTable.jsx
│  │  │  ├─ Shop
│  │  │  │  ├─ BikeButton.jsx
│  │  │  │  ├─ BikeGrid.jsx
│  │  │  │  ├─ BikeLandingPage.jsx
│  │  │  │  ├─ CollapsedFilterMenu.jsx
│  │  │  │  ├─ FilterList.jsx
│  │  │  │  ├─ FilterMenu.jsx
│  │  │  │  ├─ IndividualBikeInfo.jsx
│  │  │  │  ├─ IndividualBikeInfoNew.jsx
│  │  │  │  ├─ LoadingBikes.jsx
│  │  │  │  ├─ SearchBar.jsx
│  │  │  │  ├─ ShopContent.jsx
│  │  │  │  ├─ ShopContentNew.jsx
│  │  │  │  ├─ ShopNote.jsx
│  │  │  │  ├─ SideFilterMenu.jsx
│  │  │  │  ├─ SizeButtons.jsx
│  │  │  │  └─ priceSlider.jsx
│  │  │  └─ Uploaders
│  │  │     ├─ EditTransitions.jsx
│  │  │     └─ UploadTransitions.jsx
│  │  ├─ index.js
│  │  ├─ pages
│  │  │  ├─ AdminAddBikesNew.js
│  │  │  ├─ AdminAddBikesNorco.js
│  │  │  ├─ AdminAddBikesTransition.js
│  │  │  ├─ AdminDashboard.js
│  │  │  ├─ AdminLogin.js
│  │  │  ├─ AdminPage.js
│  │  │  ├─ AdminViewBikes.js
│  │  │  ├─ BikeDetails.js
│  │  │  ├─ Contact.js
│  │  │  ├─ Home.js
│  │  │  ├─ LogIn.js
│  │  │  ├─ ReturnPolicy.js
│  │  │  ├─ Service.js
│  │  │  └─ Shop.js
│  │  └─ theme.js
│  ├─ styles.css
│  ├─ yarn-error.log
│  └─ yarn.lock
├─ data
│  └─ db
└─ server
   ├─ api
   │  ├─ index.js
   │  └─ testingindex.js
   ├─ controllers
   │  ├─ authController.js
   │  ├─ bikeController.js
   │  └─ imageController.js
   ├─ createNewUser.js
   ├─ middleware
   │  └─ authMiddleware.js
   ├─ models
   │  ├─ AllBikes.js
   │  ├─ Other.js
   │  ├─ Transition.js
   │  ├─ User.js
   │  └─ bikeModel.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ auth.js
   │  ├─ bikes.js
   │  └─ images.js
   ├─ utils
   │  ├─ cloudinary.js
   │  └─ email.js
   ├─ vercel.json
   └─ yarn.lock

```