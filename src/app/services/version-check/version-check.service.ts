import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient) { }

  /**
   * Checks in every set frequency the version of frontend application
   *
   * @param url - version url
   * @param frequency - in milliseconds, defaults to 30 minutes
   */
  initVersionCheck(url: string, frequency = 1000 * 60 * 30): void {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   *
   * @param url - version url
   */
  private checkVersion(url: string) {
    // timestamp these requests to invalidate caches
    this.http.get(url + '?t=' + new Date().getTime()).pipe(
      first()
    )
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);

          // If new version, do something
          if (hashChanged) {
            console.log('A new version is available');
            location.reload();
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            // for an example: location.reload();
          }
          // store the new hash so we wouldn't trigger versionChange again
          // only necessary in case you did not force refresh
          this.currentHash = hash;
        },
        (err) => {
          console.error(err, 'Could not get version');
        }
      );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   *
   * @param currentHash - old versionHash
   * @param newHash - old versionHash
   */
  private hasHashChanged(currentHash: string, newHash: string): boolean {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }
    return currentHash !== newHash;
  }
}
