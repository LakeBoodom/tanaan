import type { ReactNode } from 'react';
import styles from './page.module.css';

type Feature = {
  title: string;
  description: string;
};

const featureCards: Feature[] = [
  {
    title: 'AI answer simulations',
    description:
      'Preview how AI platforms answer key buyer prompts and where your company is included or excluded.',
  },
  {
    title: 'Visibility score (0–100)',
    description:
      'Get a clear benchmark that reflects how strongly AI systems can recognize and recommend your company.',
  },
  {
    title: 'Gap analysis',
    description:
      'Identify the missing signals, unclear positioning, and weak sources that reduce your AI visibility.',
  },
  {
    title: 'Priority findings',
    description:
      'Focus on the highest-impact improvements first, ranked by how much they influence recommendation outcomes.',
  },
  {
    title: 'Before / After comparison',
    description:
      'See how your AI representation changes over time as you apply recommendations and improve your visibility.',
  },
  {
    title: 'Action plan',
    description:
      'Receive a practical roadmap with clear next steps your team can execute without technical complexity.',
  },
];

const seoBullets = [
  'Optimizes pages for search engine rankings',
  'Focuses on keywords and backlinks',
  'Measures clicks and organic traffic',
  'Competes for position in blue-link results',
];

const pellosBullets = [
  'Optimizes how AI systems understand your company',
  'Focuses on clarity, structure, and trust signals',
  'Measures recommendation visibility in AI answers',
  'Competes to be selected inside generated responses',
];

const faqQuestions = [
  'What is included in the report?',
  'How long does delivery take?',
  'Is this a subscription?',
  'Which AI platforms are analyzed?',
  'Do I need technical setup before ordering?',
  'Who is this report for?',
  'Can we use this for multiple brands?',
  'What happens after I receive the report?',
];

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <Section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <h1>AI decides if your customers ever see you</h1>
            <p>
              Buyers are already using ChatGPT and other AI tools to choose vendors. If your company
              isn’t clearly understood by AI, you’re not recommended — and you lose visibility, leads,
              and revenue.
            </p>
            <div className={styles.buttonRow}>
              <a className={styles.primaryButton} href="#pricing">
                Get my AI visibility report →
              </a>
              <a className={styles.secondaryButton} href="#report-preview">
                See example report
              </a>
            </div>
            <small>Works across ChatGPT, Gemini, Claude, Perplexity, Grok</small>
          </div>

          <aside className={styles.chatCard} aria-label="AI answer preview">
            <p className={styles.chatPrompt}>Prompt: “Best tools for [category]”</p>
            <div className={styles.chatResponse}>
              <p>1. Competitor One</p>
              <p>2. Competitor Two</p>
              <p>3. Competitor Three</p>
            </div>
            <p className={styles.chatMissing}>Your company is not included in the answer.</p>
          </aside>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>AI is already replacing search — and it’s happening fast</h2>
        <div className={styles.statGrid}>
          <article className={styles.statCard}>
            <p className={styles.statValue}>50%</p>
            <p>of B2B buyers use AI tools to research vendors before making contact</p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.statValue}>$750B</p>
            <p>in purchases will be influenced by AI-driven discovery by 2028</p>
          </article>
        </div>
        <p className={styles.smallLine}>What shows up today may not show up tomorrow</p>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>AI doesn’t rank websites — it selects a few answers</h2>
        <div className={styles.educationGrid}>
          <article className={styles.textCard}>
            <p>
              AI tools don’t show lists like Google. They interpret the question, gather information
              from multiple sources, and generate one answer — mentioning only a small number of
              companies. Make sure you’re one of them.
            </p>
          </article>
          <article className={styles.textCard}>
            <p>
              AI builds a “view” of your company from your website and other sources. If your
              offering, positioning, or use cases aren’t clearly defined and consistent, AI can’t
              confidently include you.
            </p>
          </article>
          <article className={styles.textCard}>
            <p>
              LLM SEO improves how your company is described, structured, and validated across the web
              — so AI systems can understand, trust, and recommend you in their answers.
            </p>
          </article>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>Understand how AI sees your company</h2>
        <p className={styles.sectionLead}>
          We built Pellos to show how AI sees your company — and how to improve it. See where you’re
          included, where you’re missing, and what to change to get recommended.
        </p>
        <div className={styles.valueGrid}>
          <article className={styles.valueCard}>AI visibility score</article>
          <article className={styles.valueCard}>AI answer simulations</article>
          <article className={styles.valueCard}>Clear action plan</article>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>Everything you need to get recommended by AI</h2>
        <p className={styles.sectionLead}>
          Pellos analyzes how AI sees your company and gives you a clear, actionable path to improve it.
        </p>
        <div className={styles.featureGrid}>
          {featureCards.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="report-preview">
        <h2 className={styles.sectionTitle}>See how AI sees your company</h2>
        <p className={styles.sectionLead}>A real example from a Pellos AI Visibility Report</p>
        <article className={styles.reportCard}>
          <p className={styles.reportLabel}>AI VISIBILITY SCORE</p>
          <p className={styles.reportScore}>32 / 100</p>
          <p className={styles.reportStatus}>Low AI Visibility — rarely recommended in AI answers</p>
          <p>
            Uplause is missing key signals AI relies on — making it nearly invisible in AI-driven
            discovery.
          </p>
          <div className={styles.bars}>
            <div>
              <span>Content Coverage</span>
              <div className={styles.barTrack}>
                <div style={{ width: '38%' }} />
              </div>
            </div>
            <div>
              <span>Structured Data</span>
              <div className={styles.barTrack}>
                <div style={{ width: '26%' }} />
              </div>
            </div>
            <div>
              <span>Authority &amp; Mentions</span>
              <div className={styles.barTrack}>
                <div style={{ width: '34%' }} />
              </div>
            </div>
            <div>
              <span>Clarity for AI</span>
              <div className={styles.barTrack}>
                <div style={{ width: '30%' }} />
              </div>
            </div>
          </div>
          <small>These factors determine whether AI includes your company in answers</small>
          <a className={styles.primaryButton} href="#pricing">
            Get my AI visibility report →
          </a>
        </article>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>Across all major AI platforms — not just one</h2>
        <p className={styles.sectionLead}>
          We analyze how each AI system represents your company — because they rely on different
          models, sources, and signals.
        </p>
        <ul className={styles.platformList}>
          <li>ChatGPT (OpenAI)</li>
          <li>Gemini (Google)</li>
          <li>Claude (Anthropic)</li>
          <li>Grok</li>
          <li>Perplexity</li>
        </ul>
        <small>Copilot is powered by OpenAI models — so results reflect Copilot as well</small>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>This isn’t SEO — it’s a new layer of visibility</h2>
        <p className={styles.sectionLead}>
          SEO optimizes how Google ranks your pages. AI visibility is about how AI systems understand
          your company — and whether they choose to include you in their answers.
        </p>
        <div className={styles.compareGrid}>
          <article className={styles.compareCard}>
            <h3>Traditional SEO</h3>
            <ul>
              {seoBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.compareCard}>
            <h3>Pellos AI Visibility Audit</h3>
            <ul>
              {pellosBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>Get your AI visibility report in 3 simple steps</h2>
        <ol className={styles.steps}>
          <li>Enter your company or product</li>
          <li>We analyze your AI visibility</li>
          <li>Receive your report</li>
        </ol>
        <p className={styles.smallLine}>No setup. No technical work. Just clear answers.</p>
      </Section>

      <Section id="pricing">
        <div className={styles.pricingGrid}>
          <div>
            <h2 className={styles.sectionTitle}>See how AI sees your company</h2>
            <p className={styles.price}>€399</p>
            <p className={styles.oneTime}>one-time</p>
            <p>
              Full AI visibility analysis, simulations, and action plan Less than one hour of
              consulting. Insights that impact every customer decision.
            </p>
          </div>

          <form className={styles.formCard}>
            <label>
              Company or Product Name
              <input type="text" name="company" />
            </label>
            <label>
              Website URL
              <input type="url" name="website" />
            </label>
            <label>
              Email
              <input type="email" name="email" />
            </label>
            <label>
              Brand name (optional)
              <input type="text" name="brand" />
            </label>
            <label>
              Notes (optional)
              <textarea name="notes" rows={4} />
            </label>
            <button type="submit" className={styles.primaryButton}>
              Get my AI visibility report →
            </button>
            <small>🔒 Secure payment</small>
            <ul className={styles.checklist}>
              <li>✔ Delivered within 48 hours</li>
              <li>✔ One-time purchase — no subscription</li>
              <li>✔ Clear, actionable insights</li>
            </ul>
          </form>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionTitle}>Questions before you start</h2>
        <div className={styles.faqList}>
          {faqQuestions.map((question) => (
            <details className={styles.faqItem} key={question}>
              <summary>{question}</summary>
            </details>
          ))}
        </div>
      </Section>

      <Section className={styles.finalCtaSection}>
        <div className={styles.finalCtaCard}>
          <h2 className={styles.sectionTitle}>If AI can’t see you, customers won’t either</h2>
          <a className={styles.primaryButton} href="#pricing">
            Get my AI visibility report →
          </a>
        </div>
      </Section>
    </main>
  );
}
