const SERVICE_HEADLINES: Record<string, string> = {
  'Web & Mobile Development': 'From Concept to Launch — Web & Mobile Apps That Ship Fast',
  'Digital Marketing & Growth': 'Stop Burning Budget. Start Scaling Revenue.',
  'Business Planning & Branding': 'Your Business Deserves More Than a Napkin Sketch',
  'Mentoring & Consulting': 'The 6-Month Shortcut You Have Been Looking For',
  'Profile & Portfolio Building': 'Make Your First Impression Before You Walk in the Room',
}

export function headline(title: string, type: 'course' | 'book' | 'service' | 'imprint'): string {
  if (type === 'service') {
    return SERVICE_HEADLINES[title] || `${title} That Actually Moves the Needle`
  }

  if (type === 'imprint') {
    return `Read This Before Your Competitors Do: ${title}`
  }

  if (type === 'book') {
    return `The ${title} Playbook — What They Did Not Teach You`
  }

  return courseHeadline(title)
}

function courseHeadline(title: string): string {
  const trimmed = title.trim()

  // Specific rewrites for courses that need unique hooks
  const specific: Record<string, string> = {
    'CSS Only Projects': 'Stop Overthinking. Start Building. Real CSS, Real Projects.',
    'JavaScript Only Projects': 'Theory Is Boring. This Is 100% Hands-On JavaScript.',
    'AdSense 101: Approval Blueprint': 'Get Your AdSense Approval on the First Try — Every Time',
    'AdSense Traffic & Revenue': 'Turn Website Visitors Into a Paycheck. No Guesswork.',
    'Canva for Ad Creatives': 'Design Scroll-Stopping Ads in Minutes. No Photoshop Needed.',
    'Meta Ads for Local Business': 'Your Neighbors Are Online. Here Is How to Reach Them.',
    'TikTok & Reels Ad Strategy': 'Short Attention Span? Good. That Is the New Ad Superpower.',
    'YouTube Ads Manager': 'YouTube Is the Second Biggest Search Engine. Start Advertising There.',
    'Git & GitHub for Beginners': 'Every Developer Uses Git. Be Every Developer.',
    'Kubernetes Quick Start': 'Containers Changed Everything. Kubernetes Tames the Chaos.',
    'Personal Branding & Professional Identity': 'Before They See Your Resume, They See Your Name. Make It Count.',
    'Business Writing & Professional Communication': 'Say More With Fewer Words. That Is the Superpower.',
    'Professional Office 365 Mastery': 'You Use Office Every Day. You Are Using 10% of It. Fix That.',
    'Digital Literacy & Computer Operations': 'The Basics Are Not Basic Anymore. Get Ahead by Going Back.',
    'Computer Hardware Engineering': 'Software Runs the World. Hardware Makes It Possible.',
    'Visual Brand Design & Identity': 'Your Brand Is Not a Logo. It Is a Feeling. Design That Feeling.',
    'Product Management Quick Start': 'Build the Right Thing. Not Just the Thing.',
    'Agile Project Management Essentials': 'Stop Wasting Sprints. Start Delivering.',
    'Technical Writing Essentials': 'Developer to Developer: Documentation Is Product.',
    'Network Security Essentials': 'The Weakest Link Is Usually Human. Make It You? No.',
    'Cybersecurity Fundamentals: Network & Systems Defense': 'The Internet Is Dangerous. Learn to Defend It.',
    'Ethical Hacking Fast Track': 'Think Like a Hacker. Defend Like a Pro. Do It Fast.',
    'Data Analysis Fast Track': 'Turn Messy Data Into Decisions That Move the Needle',
    'Data Structures & Algorithms Fundamentals': 'The Interview Loves DSA. So Should You.',
    'Python for Data Science & Analytics': 'The Language of AI. The Skill of the Decade.',
    'Machine Learning Crash Course': 'Teach Machines to Think. Build the Future. This Weekend.',
    'Intro to Coding': 'Write Your First Line of Code. Then Build Something That Matters.',
    'Intro to Cybersecurity': 'Hackers Are Learning. So Should You.',
    'Intro to Data & AI': 'AI Is Not Coming. It Is Here. Get on Board.',
    'Intro to Design': 'You Have an Eye for It. Now Learn the Craft.',
    'Intro to Cloud Computing': 'The Cloud Runs Everything You Love. Learn to Run the Cloud.',
    'Intro to Digital Marketing': 'Everyone Can Market. Few Know How. Be the Few.',
    'Intro to Digital Media Buying': 'Money + Data + Creative = Growth. Learn the Equation.',
    'Intro to Professional Writing': 'Good Writers Get Promoted. Great Writers Get Remembered.',
    'Intro to Leadership & Management': 'The First Time Manager Playbook. Your Team Deserves It.',
    'Intro to Software Development': 'You Use Software All Day. Now Learn to Build It.',
    'Intro to Networking & Infrastructure': 'The Internet Is a Series of Tubes. Learn to Wire Them.',
    'Intro to Digital Literacy': 'Digital Is Not Optional Anymore. Master the Basics.',
    'Intro to Algorithms & Problem Solving': 'Think Like a Programmer. Solve Problems Before They Happen.',
  }

  if (specific[trimmed]) return specific[trimmed]

  // Pattern-based rewrites
  if (/^(?:Advanced)\s+(.+?)(?:\s*Mastery)?$/.test(trimmed)) {
    return `You Have Mastered the Basics. Now Go Beyond ${trimmed.replace(/^Advanced\s+/, '')}.`
  }

  if (/\bBootcamp\b/.test(trimmed)) {
    return `From Beginner to Job-Ready: ${trimmed.replace(/\s+Bootcamp$/, '')}. No Detours.`
  }

  if (/\bCrash Course\b/.test(trimmed)) {
    const topic = trimmed.replace(/\s+Crash Course.*$/, '')
    return `${topic} at Warp Speed. No Theory. All Results.`
  }

  if (/\bFast Track\b/.test(trimmed)) {
    const topic = trimmed.replace(/\s+Fast Track.*$/, '')
    return `The Express Lane to ${topic}. Your Competitors Are Already on It.`
  }

  if (/\bQuick Start\b/.test(trimmed)) {
    const topic = trimmed.replace(/\s+Quick Start.*$/, '')
    return `Ship Your First ${topic} Project Before the Weekend Is Over`
  }

  if (/\b(?:Fundamentals|Essentials)\b/.test(trimmed)) {
    const topic = trimmed.replace(/\s+(?:Fundamentals|Essentials).*$/, '')
    return `The ${topic} Foundation That 90% of Courses Skip`
  }

  if (/^SEO\b/.test(trimmed)) {
    return 'Google Top 10 Is Not Luck. It Is a Formula. Learn It.'
  }

  if (/\bMastery\b/.test(trimmed)) {
    return `You Have Outgrown Beginner. Now Become an Expert in ${trimmed.replace(/\s+Mastery.*$/, '')}.`
  }

  if (/\bAccelerator\b/.test(trimmed)) {
    const topic = trimmed.replace(/\s+Accelerator.*$/, '')
    return `Stop Slow Growth. ${topic} at Full Speed.`
  }

  // Generic fallback: extract the core topic and make a promise
  const core = trimmed
    .replace(/^Intro to\s+/i, '')
    .replace(/\s+(?:for|with).*$/i, '')
    .replace(/\(.*?\)/g, '')
    .trim()

  if (core && core !== trimmed) {
    return `${core} — The Skill That Opens Every Door`
  }

  return `${trimmed} — Stop Watching Tutorials. Start Building.`
}
