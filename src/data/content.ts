export interface Faq {
  q: string
  a: string
}

export const FAQS: Faq[] = [
  {
    q: 'Who can participate in Appathon?',
    a: 'Open exclusively to students currently enrolled in undergraduate (UG) degree programmes.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No fee has been announced for this edition. The registration fee field on this site says “To be announced” until the organising institution confirms it. If a fee is introduced, it will be published here and in an announcement before registrations close — never charged silently.',
  },
  {
    q: 'How do I register?',
    a: 'Fill in the Registration form with the two participant records and project details. You will receive a unique registration ID (for example APP-2026-1001). Keep it safe — you need it, together with your registered email, to submit your project and to check your status.',
  },
  {
    q: 'Can I register more than once?',
    a: 'No. One registration per email address and mobile number. If you try to register again with the same email or phone, the form will show your existing registration ID instead of creating a duplicate. Contact the coordinators if you need to correct a mistake.',
  },
  {
    q: 'What do I submit, and by when?',
    a: 'After registering, use the Project Submission page: verify with your registration ID and email, then upload supporting documents, add your demo / video links and a short description. The submission deadline is published on the Schedule page — it currently reads “To be announced” until confirmed.',
  },
  {
    q: 'How are projects evaluated?',
    a: 'Judges score each project on innovation, technical execution, impact and presentation. Shortlisted teams present in the final round. The full criteria and weightage are on the Rules & Guidelines page.',
  },
  {
    q: 'Do all participants get certificates?',
    a: 'Participation certificates are planned for all participants who complete a valid submission. First Prize and Second Prize details are “To be announced” until the organisers confirm them — this site does not invent prize amounts.',
  },
  {
    q: 'Can I change my project after registering?',
    a: 'Yes, before the submission deadline: re-submit through the Project Submission page with the same registration ID — the latest submission replaces the earlier one. After the deadline, changes need coordinator approval.',
  },
  {
    q: 'Who do I contact for help?',
    a: 'Use the Contact page. Faculty and student coordinator details are published there once confirmed; until then, use the official email shown on that page. For a lost registration ID, use the “Find my registration” help on the Submission page.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your details are used only for running the competition — registration, verification, judging and certificates. We never sell participant data. See the Privacy note on the Registration page and the security section in the README / Supabase setup guide.',
  },
]

export const EVALUATION_CRITERIA = [
  { name: 'Innovation & originality', weight: '30%', detail: 'Is the idea new, and does it solve the problem in a fresh way?' },
  { name: 'Technical execution', weight: '30%', detail: 'Does it work? Code quality, reliability and completeness of the demo.' },
  { name: 'Impact & feasibility', weight: '25%', detail: 'Who benefits, how many, and can it realistically be built and sustained?' },
  { name: 'Presentation & clarity', weight: '15%', detail: 'Can the team explain the problem, the solution and the next steps clearly?' },
]
