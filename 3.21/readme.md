Sadly, I could not complete this exercise.
Heroku's free plan was announced to end and fly.io gave me error's when launching the app (using flyctl launch gave me the error "Error name argument or flag must be specified when not running interactively") or trying to create an app (flyctl apps create MyApp returned "Error We need your payment information to continue! Add a credit card or buy credit")

The good side of this, it's in local this works :)

Also, noticing what is posted on this lesson, it would be very important to write on gitignore file that is should NOT post the .env file and set the sensible data as heroku or fly.io says you should post that information (for example, the credentials for Mongo Atlas)