export default function Privacy() {
  const Title = { marginTop: '24px' }
  const Paragraph = { margin: '24px', fontStyle: 'italic', opacity: 0.75 }
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>Privacy Policy</h1>

      <h2 style={Title}>1. Introduction</h2>
      <p style={Paragraph}>
        This privacy policy explains how data is collected, used, and protected
        when interacting with rebutify.org.
        <br />
        As an open-source project, contributors and maintainers share the
        responsibility to ensure compliance with this policy.
      </p>

      <h2 style={Title}>2. Data We Collect</h2>
      <p style={Paragraph}>
        This website track basic information about its visitors.
        <br />
        None of this information can personally identify specific visitors to this
        website.
        <br />
        The information is tracked for routine administration and maintenance
        purposes.
        <br />
        We may collect:
      </p>
      <ul>
        <li>
          <span style={{ textDecoration: 'underline', marginRight: '6px' }}>
            User-provided data:
          </span>
          Information users provide when interacting with the project (e.g.,
          through forms, issue reporting, or account creation).
        </li>
        <li>
          <span style={{ textDecoration: 'underline', marginRight: '6px' }}>
            Automatically collected data:
          </span>
          Non-personal information such as IP addresses, browser type, and usage
          statistics for improving the platform.
        </li>
      </ul>

      <h2 style={Title}>3. How We Use Your Data</h2>
      <p style={Paragraph}>
        We use the collected data for the following purposes:
      </p>
      <ul>
        <li>Operate, maintain, and improve the platform.</li>
        <li>Ensure security and prevent misuse of the platform.</li>
        <li>
          Communicate updates, handle issues, and respond to user inquiries.
        </li>
      </ul>

      <h2 style={Title}>4. Who Can Access Your Data</h2>
      <p style={Paragraph}>
        We do not share user data with third parties.
        <br />
        Only the following people have access to your data:
      </p>
      <ul>
        <li>
          <span style={{ textDecoration: 'underline', marginRight: '6px' }}>
            Core Team:
          </span>
          Our core team members may access user data when performing maintenance
          or resolving issues.
        </li>
        <li>
          <span style={{ textDecoration: 'underline', marginRight: '6px' }}>
            Community Roles:
          </span>
          Contributors with elevated roles may access more sensitive data, but
          only for legitimate purposes.
        </li>
      </ul>

      <h2 style={Title}>5. Data Security</h2>
      <p style={Paragraph}>
        The security of your personal information is important to us, but remember
        that no method of transmission over the Internet, or method of electronic
        storage, is 100% secure. While we strive to use commercially acceptable
        means to protect your personal information, we cannot guarantee its
        absolute security.
      </p>
      <ul>
        <li>
          We take reasonable measures to protect your data from unauthorized
          access, alteration, or destruction.
        </li>
      </ul>

      <h2 style={Title}>6. Transparency and User Rights</h2>
      <p style={Paragraph}>Users have the right to:</p>
      <ul>
        <li>Access, modify, or request deletion of their personal data.</li>
        <li>Opt out of data collection.</li>
        <li>Receive a copy of their personal data.</li>
        <li>
          Report any concerns at{' '}
          <code>https://github.com/rebutify/rebutify/issues</code>
        </li>
      </ul>

      <h2 style={Title}>7. Changes to This Policy</h2>
      <p style={Paragraph}>
        This Privacy Policy is effective as of 01-01-2025 and will remain in
        effect except concerning any changes in its provisions in the future,
        which will be in effect immediately after being posted on this page.
        <br />
        We reserve the right to update or change our Privacy Policy at any time
        and you should check this Privacy Policy periodically.
        <br />
        If we make any material changes to this Privacy Policy, we will notify you
        either through the email address you have provided us or by placing a
        prominent notice on our website.
      </p>
      <ul>
        <li>
          We may update this policy periodically to reflect changes in our
          practices.
        </li>
        <li>
          We will notify you about significant changes in our Privacy Policy by
          sending you an email.
        </li>
      </ul>
    </div>
  )
}
