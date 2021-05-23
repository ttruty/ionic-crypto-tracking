#  Crypto Cryptids
#### Video Demo:  https://www.youtube.com/watch?v=g3Ro1Mgqftk

### Description:
The project is an Ionic/Angular(typescript) based using Capactior platform to provide native android support.
The backend storage will be firebase authentication to auth the user, firestore to store that database data and storage for the image files.
The user will be able to log in and view other user finds and hunts, and post images of their own cryptid finds.

### Quick Pitch
A platform to hunt and find cryptid creatures using smart phones' GPS and camera. Capture all the cryptids you can!

### In depth
The app uses google firebase authentication. The user must sign up with a user name and password. There is validation on the signup form to take valid email input and a password with a minimum length of 6 characters (firebase requirement).
The pages beyond the signup/login page are gaurded with an auth gaurd. Only allowing access once the user is authenticated. Once logged in there are 3 main modules discover, create hunts, and my hunts.
The discover page is the main page of the app. This will fetch the list of cryptid hunts from the firebase backend. These is also a filter on this page to select "All hunts" vs "huntable". This selection tab filters to only show the created huntst that are from other users, as you would not want to sign up for your own hunts... you know where to find them.
The create hunt page will bring up a form where the user is able to enter the title and description of the hunt. The user is also able to select a location on the map using the google maps API. The user is also able to select or take a photo using the native camera capabilities with Capacitor.
Once. the new cryptid hunt is created the user is returned to the discover page, and their newly created hunt is now the featured hunt on the page. This featured hunt is alway the most recent post.
If the user selects a different hunt they are taken to the description of the hunt where they are can see the photo, locaton, and title. There are then able to click the "Add to my hunt" button. This adds the hunt to the use's active hunts. If they select active hunts page they are able to use the sliding navigation on the item to delete or say it was found.
When the hunt is found, the found count increases in the database.

### Design justifications
The project uses Ionic as it is a easy way to have one code base to develope for both iOS and Android. I designed and build this project for CS50 final in conjunction with taking this Udemy Ionic class https://www.udemy.com/course/ionic-2-the-practical-guide-to-building-ios-android-apps/
There was no final submission for that class, so this project was designed and built for personal growth and CS50 final. The firebase justification allows for a scalable and robust application backend that will be accessible and fualt tolerant. Firebases free teir is also a great way to learn.

### Tech stack
- Languages- typescript, html, javascript, css
- Frameworks- Ionic, Angular, Capacitor
- Backend- Firebase Auth, Firebase real-time database, Firebase storage, Firebase functions - Google Maps, Places, Geolocation API

