import { Injectable } from '@angular/core';
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authen: AngularFireAuth) {
  }

  signInWithApple() {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    const auth = getAuth();
    signInWithPopup(auth, provider).then((result) => {
      // The signed-in user info.
      const user = result.user;

      // Apple credential
      const credential = OAuthProvider.credentialFromResult(result);
      console.log(credential);
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The credential that was used.
      const credential = OAuthProvider.credentialFromError(error);
    })
  }

  signInWithGoogle() {
    return this.authen.signInWithPopup(new GoogleAuthProvider());
  }

  signInWithFacebook() {
    const fbAuthProvider = new FacebookAuthProvider();
    fbAuthProvider.addScope('email');
    fbAuthProvider.addScope('public_profile');
    fbAuthProvider.addScope('user_posts');
    fbAuthProvider.addScope('user_photos');
    fbAuthProvider.addScope('user_videos');
    fbAuthProvider.addScope('user_likes');
    return this.authen.signInWithPopup(fbAuthProvider);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.authen.signInWithEmailAndPassword(email, password)
  }
  registerWithEmailAndPassword(email: string, password: string) {
    return this.authen.createUserWithEmailAndPassword(email, password)
  }
}
