export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  author: string;
  content: string; // HTML content
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "top-5-resume-mistakes-2026",
    title: "Top 5 Resume Mistakes That Instantly Get You Rejected in 2026",
    date: "2026-05-18",
    excerpt: "Recruiters spend an average of 6 seconds looking at your resume. Are you making these critical formatting and content mistakes that lead to an instant rejection?",
    readTime: "5 min read",
    author: "Hired or Roasted Team",
    content: `
      <h2>The 6-Second Rule is Real</h2>
      <p>In 2026, the job market is more competitive than ever before. With AI screening tools and Applicant Tracking Systems (ATS) filtering out up to 75% of applications before a human even sees them, your resume needs to be absolutely flawless. Recruiters spend an average of just 6 seconds skimming a resume to decide whether it belongs in the 'interview' pile or the trash. If you are making any of these five critical mistakes, your chances of landing your dream job are virtually zero.</p>
      
      <h2>1. The Objective Statement is Dead</h2>
      <p>Ten years ago, it was standard practice to include an 'Objective Statement' at the top of your resume (e.g., "Seeking a challenging role in software engineering to utilize my skills"). Today, this is considered a massive waste of prime real estate. Recruiters know your objective is to get the job. Instead, replace this outdated section with a powerful <strong>Professional Summary</strong>. A summary should be a 3-4 sentence elevator pitch highlighting your years of experience, your top technical skills, and your biggest career achievement. Make it punchy, metric-driven, and highly relevant to the job you are applying for.</p>
      
      <h2>2. Lack of Quantifiable Metrics</h2>
      <p>This is the number one reason resumes get roasted by our AI engine. Writing "Responsible for managing a team and increasing sales" means absolutely nothing. Anyone can write that. You must quantify your impact using hard numbers. How big was the team? What was the percentage increase in sales? In what timeframe?</p>
      <p>Instead of the previous bullet point, write: <em>"Managed a cross-functional team of 12 engineers to deliver a highly scalable SaaS product, resulting in a 45% increase in annual recurring revenue (ARR) within 6 months."</em> Numbers draw the recruiter's eye and prove your actual worth.</p>

      <h2>3. Terrible Formatting and Crazy Fonts</h2>
      <p>We see it all the time: candidates trying to stand out by using multiple columns, bright colors, progress bars for skills, and fancy fonts. While this might look pretty to you, it completely breaks Applicant Tracking Systems. ATS bots read text from left to right, top to bottom. If your resume has a complex multi-column layout, the bot will likely scramble your text into a massive, unreadable block, automatically disqualifying you.</p>
      <p>Stick to a clean, single-column layout. Use standard fonts like Arial, Calibri, Garamond, or Inter. Use bolding to highlight your job titles and companies, and keep your margins clean. Professionalism beats creativity when it comes to resumes.</p>

      <h2>4. The 'Duties Included' Trap</h2>
      <p>Your resume is a marketing document, not a legal job description. Do not list out your daily tasks. "Responsible for answering emails" or "Tasked with maintaining the database" do not sell you as a high performer. You must shift your mindset from a <em>task-based</em> resume to an <em>achievement-based</em> resume. Focus on what you accomplished, the problems you solved, and the value you brought to the company.</p>

      <h2>5. Typos and Grammatical Errors</h2>
      <p>It sounds obvious, but you would be shocked at how many senior-level resumes contain blatant spelling errors. In a highly competitive market, a single typo can be all it takes for a recruiter to reject you. It signals a lack of attention to detail and a lack of care. Always use tools like Grammarly, and more importantly, run your resume through an AI critique tool like <strong>Hired or Roasted</strong> to catch errors and weak phrasing before you hit submit.</p>

      <div class="my-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-2xl text-center">
        <h3 class="text-xl font-bold text-white mb-2">Is your resume making these mistakes?</h3>
        <p class="text-gray-300 mb-4">Don't guess. Let our savage AI recruiter tear apart your resume and give you actionable fixes.</p>
        <a href="/" class="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors">Roast My Resume Now</a>
      </div>
    `
  },
  {
    id: "2",
    slug: "how-ats-systems-read-resumes",
    title: "How ATS Systems Actually Read Your Resume",
    date: "2026-05-15",
    excerpt: "Applicant Tracking Systems (ATS) are the gatekeepers of the modern job hunt. Learn exactly how these algorithms parse your PDF and how to beat them.",
    readTime: "6 min read",
    author: "Hired or Roasted Team",
    content: `
      <h2>The Invisible Gatekeeper</h2>
      <p>You spent hours crafting the perfect cover letter and tailoring your resume, only to receive an automated rejection email just two hours later. How is this possible? Did the hiring manager even read it? The hard truth is: No. A human never saw your application. You were rejected by an Applicant Tracking System (ATS).</p>
      <p>Understanding how an ATS works is no longer optional; it is mandatory for modern job seekers. Over 98% of Fortune 500 companies and a growing majority of startups use these software systems to manage the flood of applications they receive daily.</p>

      <h2>How Parsing Actually Works</h2>
      <p>When you upload your PDF or Word document, the ATS uses Optical Character Recognition (OCR) and text parsing algorithms to extract your information. It looks for specific headings like "Experience," "Education," and "Skills." Once it finds these sections, it attempts to map your text into a standardized database profile.</p>
      <p>This is where things usually go wrong. If you use a non-standard heading like "My Career Journey" instead of "Professional Experience," the ATS might skip your entire work history. If you use complex tables or graphic elements, the parser gets confused and scrambles the text.</p>

      <h2>Keyword Matching and Scoring</h2>
      <p>Once your profile is generated, the ATS scores you against the specific job description. It scans your resume for exact keyword matches. If the job description asks for "Agile Project Management" and your resume says "Scrum Master," human recruiters know they are similar, but a poorly configured ATS might penalize you for missing the exact keyword phrase.</p>
      <p>To beat the ATS, you must mirror the language used in the job posting. If they ask for 'Customer Success,' do not write 'Client Relations.' Use their exact terminology naturally throughout your bullet points.</p>

      <h2>The PDF vs Word Debate</h2>
      <p>There is a lot of conflicting advice online about file formats. In 2026, modern ATS platforms can parse PDFs perfectly fine—<strong>provided the PDF is exported from a text editor like Word or Google Docs</strong>. However, if you "Print to PDF" from a complex design software like Photoshop or Canva, the text is often flattened into an image, making it completely invisible to the ATS. Always highlight the text in your PDF before sending it; if you can highlight it, the bot can read it.</p>

      <h2>The Invisible Text Hack (Don't Do It)</h2>
      <p>A famous hack from a few years ago was "keyword stuffing"—typing out all the keywords from the job description in size 1 white font at the bottom of the resume. Do not do this. Modern ATS systems flag this behavior immediately, and it will instantly blacklist you from the company. The only way to win is to legitimately incorporate the required skills into your experience bullet points.</p>

      <div class="my-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-2xl text-center">
        <h3 class="text-xl font-bold text-white mb-2">Beat the ATS with AI</h3>
        <p class="text-gray-300 mb-4">Our AI doesn't just roast your resume—it gives you the exact metric-driven bullet points you need to pass ATS filters.</p>
        <a href="/" class="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors">Optimize Your Resume</a>
      </div>
    `
  },
  {
    id: "3",
    slug: "stop-using-buzzwords",
    title: "Why You Need to Stop Using Buzzwords on Your Resume",
    date: "2026-05-10",
    excerpt: "Calling yourself a 'Synergistic Team Player' or a 'Results-Driven Rockstar' is destroying your credibility. Here is how to use strong action verbs instead.",
    readTime: "4 min read",
    author: "Hired or Roasted Team",
    content: `
      <h2>The Fluff Epidemic</h2>
      <p>If you describe yourself as a "results-driven, proactive team player with excellent communication skills," you have essentially described absolutely nothing. These phrases are what recruiters call 'fluff'—meaningless filler words that take up valuable space on your resume without providing any tangible evidence of your abilities.</p>
      <p>In a pile of 500 resumes, 400 of them will claim to be "hardworking" or "detail-oriented." Using these adjectives does not make you stand out; it makes you blend in with the noise.</p>

      <h2>Show, Don't Tell</h2>
      <p>The golden rule of resume writing is "Show, Don't Tell." Anyone can claim to have excellent leadership skills. A strong candidate *proves* it. Instead of writing "Excellent leadership skills," you should write: "Mentored a team of 5 junior developers and led the successful launch of 3 core product features ahead of schedule."</p>
      <p>Do you see the difference? The first is an empty claim. The second is undeniable proof.</p>

      <h2>The Worst Offenders</h2>
      <p>Here is a list of buzzwords you should immediately delete from your resume:</p>
      <ul class="list-disc pl-6 my-4 space-y-2 text-gray-300">
        <li><strong>Synergy / Synergistic:</strong> Corporate jargon that means nothing.</li>
        <li><strong>Rockstar / Ninja:</strong> Unprofessional and outdated.</li>
        <li><strong>Go-getter:</strong> Prove it with numbers instead.</li>
        <li><strong>Detail-oriented:</strong> If you are detail-oriented, your resume should have zero typos and perfect formatting. That speaks for itself.</li>
        <li><strong>Think outside the box:</strong> A tired cliché. Give an example of a creative solution you implemented instead.</li>
      </ul>

      <h2>The Power of Action Verbs</h2>
      <p>Replace weak adjectives with strong action verbs at the beginning of every bullet point. Words like <em>Spearheaded, Architected, Orchestrated, Optimized,</em> and <em>Generated</em> command attention and imply ownership of the task.</p>
      <p>For example, change "Helped with the marketing campaign" to "Spearheaded a multi-channel marketing campaign that generated $50k in pipeline revenue."</p>
      <p>By purging the fluff from your resume and replacing it with hard data and strong verbs, you instantly elevate yourself into the top 5% of candidates. It demonstrates that you respect the recruiter's time and that you truly understand your own value.</p>
    `
  }
];
