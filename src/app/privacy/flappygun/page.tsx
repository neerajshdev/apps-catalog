import React from 'react';
import Navbar from '@/components/Navbar';
import styles from './privacy.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FlappyGun | VAULT.DIST',
  description: 'Privacy Policy for the FlappyGun mobile game.',
};

export default function FlappyGunPrivacyPolicy() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Privacy Policy for FlappyGun</h1>
          <p className={styles.lastUpdated}>Last Updated: October 2026</p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to FlappyGun. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you play our mobile game, FlappyGun. By using the app, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <p>We, along with our third-party service providers (such as Appodeal and Google), may collect the following types of information for app functionality, advertising, and analytics:</p>
            <ul>
              <li><strong>Personal Information:</strong> Your Google Play Games Profile Name and User ID (collected for authentication and leaderboards).</li>
              <li><strong>Device & Identifiers:</strong> Device identifiers (including Advertising IDs) and your IP address for ad personalization, analytics, and fraud prevention.</li>
              <li><strong>Location Data:</strong> Approximate location for localized advertising.</li>
              <li><strong>App Activity & Performance:</strong> App interactions, crash logs, and diagnostics to improve game performance and stability.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>The collected information is used for the following purposes:</p>
            <ul>
              <li>To provide and maintain the game's core functionality, including the global leaderboard system via Google Play Games Services.</li>
              <li>To serve personalized and non-personalized advertisements via the Appodeal Ad Network and its partners.</li>
              <li>To monitor app performance, debug crashes, and analyze user interactions to improve the gameplay experience.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Third-Party Services</h2>
            <p>
              FlappyGun integrates third-party services that have their own privacy policies. We encourage you to review their policies:
            </p>
            <ul>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Play Services & Google Play Games</a>
              </li>
              <li>
                <a href="https://www.appodeal.com/privacy-policy" target="_blank" rel="noreferrer">Appodeal Ad Network</a>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Children's Privacy (COPPA)</h2>
            <p>
              These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. European Privacy Rights (GDPR)</h2>
            <p>
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. You have the right to access, update, or delete the information we have on you, as well as the right of rectification, objection, and data portability. To exercise these rights, please contact us or use your Google Account settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) grants you specific rights regarding your personal information. You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months. You also have the right to request the deletion of your personal information. Under CCPA, targeted advertising may be considered a "sale" of personal data. You have the right to opt-out of ad tracking via your device's privacy settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Data Retention and Deletion</h2>
            <p>
              We do not store your personal identity data on our own remote servers; your authentication and scores are managed directly through Google Play Games Services. You can manage, view, or delete your Play Games data at any time through your Google Account settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Security</h2>
            <p>
              All data transmitted between the app and external services (Google Play Games, Ad Networks) is encrypted in transit. We value your trust in providing us your information, thus we strive to use commercially acceptable means of protecting it.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, or if you wish to exercise your data rights, please contact our Data Protection Officer at:
            </p>
            <p><strong>Email:</strong> <a href="mailto:privacy@chikuapps.com">privacy@chikuapps.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
}
