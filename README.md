# BuyBooks

## Install Locally
```bash
git clone https://github.com/DilipKhunti/BuyBooks.git
cd BuyBooks
```
 - remove `.example` from file name `.env.example`
 - place your api keys in `.env` file

 ```bash
cd backend
npm i
 ```
 - run below to start development server
 ```bash
 npm run dev
 ```
 -run below to node server
 ```bash 
 npm run start
 ```
 - open `frontend/index.html` in browser to see website in action

 # Directory Structure


```plaintext
Directory structure:
└── BuyBooks/
    ├── README.md
    ├── backend/
    │   ├── app.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── .env.example
    │   ├── conn/
    │   │   └── conn.js
    │   ├── models/
    │   │   ├── book.js
    │   │   ├── category.js
    │   │   ├── order.js
    │   │   └── user.js
    │   └── routes/
    │       ├── book.js
    │       ├── cart.js
    │       ├── category.js
    │       ├── favourites.js
    │       ├── order.js
    │       ├── user.js
    │       └── userAuth.js
    └── frontend/
        ├── about.html
        ├── book.html
        ├── checkout.html
        ├── contact.html
        ├── edit-book.html
        ├── index.html
        ├── profile.html
        ├── sell.html
        ├── shop.html
        ├── shoping-cart.html
        ├── sign-in.html
        ├── sign-up.html
        ├── wisslist.html
        ├── css/
        │   ├── barfiller.css
        │   ├── elegant-icons.css
        │   ├── flaticon.css
        │   ├── magnific-popup.css
        │   ├── nice-select.css
        │   ├── style.css
        │   └── user-auth.css
        ├── fonts/
        │   ├── ElegantIcons.eot
        │   ├── ElegantIcons.ttf
        │   ├── ElegantIcons.woff
        │   ├── Flaticon.eot
        │   ├── Flaticon.ttf
        │   ├── Flaticon.woff
        │   ├── FontAwesome.otf
        │   ├── fontawesome-webfont.eot
        │   ├── fontawesome-webfont.ttf
        │   ├── fontawesome-webfont.woff
        │   └── fontawesome-webfont.woff2
        ├── img/
        │   ├── books/
        │   ├── bookstores/
        │   ├── hero/
        │   ├── icon/
        │   └── logo/
        └── js/
            ├── config.js
            ├── jquery.barfiller.js
            ├── jquery.slicknav.js
            ├── main.js
            └── pages/
                ├── book.js
                ├── edit-book.js
                ├── index.js
                ├── profile.js
                ├── sell.js
                ├── shop.js
                ├── shoping-cart.js
                ├── sign-in.js
                ├── sign-up.js
                └── wishlist.js

```