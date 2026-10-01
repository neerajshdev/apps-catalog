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
              <li><strong>Device & Identifiers:</strong> Device identifiers (such as Advertising IDs) for ad personalization.</li>
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
                <a href="https://appodeal.com/privacy-policy/" target="_blank" rel="noreferrer">Appodeal Ad Network</a>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Data Retention and Deletion</h2>
            <p>
              We do not store your personal identity data on our own remote servers; your authentication and scores are managed directly through Google Play Games Services. You can manage, view, or delete your Play Games data at any time through your Google Account settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Security</h2>
            <p>
              All data transmitted between the app and external services (Google Play Games, Ad Networks) is encrypted in transit. We value your trust in providing us your information, thus we strive to use commercially acceptable means of protecting it.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact the developer.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
