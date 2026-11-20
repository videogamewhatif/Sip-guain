import { pourFrame, pourGlass } from '@/lib/pour.mjs';

const rest = pourFrame(0);
const { centerX, rimY, rimRadius, rimDepth, shoulderY, bowlRadius, bowlDepth } = pourGlass;
const leftRim = centerX - rimRadius;
const rightRim = centerX + rimRadius;
const leftBowl = centerX - bowlRadius;
const rightBowl = centerX + bowlRadius;
const bowl = `M${leftRim} ${rimY} C${leftRim - 6} ${rimY + 19} ${leftBowl} ${shoulderY - 13} ${leftBowl} ${shoulderY} A${bowlRadius} ${bowlDepth} 0 0 0 ${rightBowl} ${shoulderY} C${rightBowl} ${shoulderY - 13} ${rightRim + 6} ${rimY + 19} ${rightRim} ${rimY}`;
const backRim = `A${rimRadius} ${rimDepth} 0 0 0 ${leftRim} ${rimY}`;
const frontRim = `M${leftRim} ${rimY} A${rimRadius} ${rimDepth} 0 0 0 ${rightRim} ${rimY}`;
const glass = `${bowl} ${backRim} Z`;
const refraction = `translate(${centerX} ${shoulderY}) scale(.86 1.09) translate(${-centerX} ${-shoulderY})`;

export default function PourArt() {
  return (
    <svg viewBox="65 52 590 495" role="img" aria-label="Una botella de Malbec de Sip Güain vertiendo vino tinto en una copa al desplazarse">
      <defs>
        <image id="pour-right-vine" href="/images/botanical.svg" x="-678" y="126" width="259" height="371" transform="scale(-1 1)"/>
        <mask id="pour-vine-outside-glass" maskUnits="userSpaceOnUse" x="65" y="52" width="590" height="495">
          <rect x="65" y="52" width="590" height="495" fill="white"/>
          <path d={glass} fill="black"/>
        </mask>
        <radialGradient id="pour-floor">
          <stop stopColor="#4a302a" stopOpacity=".35"/>
          <stop offset=".48" stopColor="#634237" stopOpacity=".19"/>
          <stop offset="1" stopColor="#634237" stopOpacity="0"/>
        </radialGradient>
        <clipPath id="pour-open-bottle">
          <rect x="-43" y="-158" width="86" height="354"/>
        </clipPath>
        <linearGradient id="pour-neck" x2="1">
          <stop stopColor="#b8aab1"/><stop offset=".23" stopColor="#aa9da4"/>
          <stop offset=".43" stopColor="#353032"/><stop offset=".65" stopColor="#151514"/>
          <stop offset="1" stopColor="#514b4f"/>
        </linearGradient>
        <linearGradient id="pour-lip" x2=".32" y2="1">
          <stop stopColor="#f2e5c6"/><stop offset=".32" stopColor="#aa9c80"/>
          <stop offset=".7" stopColor="#302b23"/><stop offset="1" stopColor="#76705d"/>
        </linearGradient>
        <linearGradient id="pour-wall" x2="1">
          <stop stopColor="#876657" stopOpacity=".37"/><stop offset=".035" stopColor="#fffaf0" stopOpacity=".68"/>
          <stop offset=".095" stopColor="#a88372" stopOpacity=".2"/><stop offset=".21" stopColor="#fff7e9" stopOpacity=".08"/>
          <stop offset=".73" stopColor="#f8eddf" stopOpacity=".1"/><stop offset=".9" stopColor="#fff8ea" stopOpacity=".48"/>
          <stop offset=".965" stopColor="#8b6c64" stopOpacity=".34"/><stop offset="1" stopColor="#fff8e9" stopOpacity=".74"/>
        </linearGradient>
        <linearGradient id="pour-glass-shine" x2="0" y2="1">
          <stop stopColor="#fffcf4" stopOpacity=".9"/><stop offset=".58" stopColor="#fff9ed" stopOpacity=".46"/>
          <stop offset="1" stopColor="#fff0db" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="pour-glass-rim" x2="1">
          <stop stopColor="#957666"/><stop offset=".19" stopColor="#fffaf1"/>
          <stop offset=".54" stopColor="#a38b7d"/><stop offset=".79" stopColor="#f7e8d5"/>
          <stop offset="1" stopColor="#967d6e"/>
        </linearGradient>
        <linearGradient id="pour-glass-foot" x2=".26" y2="1">
          <stop stopColor="#fff9ef" stopOpacity=".64"/><stop offset=".45" stopColor="#fff6e8" stopOpacity=".06"/>
          <stop offset="1" stopColor="#977967" stopOpacity=".48"/>
        </linearGradient>
        <linearGradient id="pour-wine-body" gradientUnits="userSpaceOnUse" x1={leftBowl} x2={rightBowl}>
          <stop stopColor="#a72b3e" stopOpacity=".69"/><stop offset=".13" stopColor="#a02539" stopOpacity=".92"/>
          <stop offset=".32" stopColor="#6e1428"/><stop offset=".62" stopColor="#42101e"/>
          <stop offset=".86" stopColor="#68152a"/><stop offset="1" stopColor="#a63346" stopOpacity=".84"/>
        </linearGradient>
        <linearGradient id="pour-wine-top" x2=".24" y2="1">
          <stop stopColor="#a03947"/><stop offset=".36" stopColor="#681829"/>
          <stop offset=".68" stopColor="#4a101e"/><stop offset="1" stopColor="#8c2a3b"/>
        </linearGradient>
        <radialGradient id="pour-wine-reflection">
          <stop stopColor="#f2a18c" stopOpacity=".5"/><stop offset="1" stopColor="#d96b59" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="pour-jet-color" x2=".24" y2="1">
          <stop stopColor="#5c1324"/><stop offset=".37" stopColor="#8b2338"/>
          <stop offset=".76" stopColor="#68172a"/><stop offset="1" stopColor="#9b3040"/>
        </linearGradient>
        <clipPath id="pour-bowl-clip"><path d={glass}/></clipPath>
        <clipPath id="pour-surface-clip"><circle r="1"/></clipPath>
      </defs>

      <circle cx="379" cy="301" r="224" fill="#e9daca" opacity=".65"/>
      <circle cx="379" cy="301" r="231" fill="none" stroke="#9b725f" opacity=".32" strokeDasharray="1 5"/>
      <image href="/images/botanical.svg" x="83" y="165" width="252" height="354" opacity=".68"/>
      <use href="#pour-right-vine" mask="url(#pour-vine-outside-glass)" opacity=".54"/>
      <g clipPath="url(#pour-bowl-clip)">
        <use href="#pour-right-vine" transform={refraction} opacity=".36"/>
      </g>
      <image href="/images/monarch.svg" x="502" y="127" width="77" height="58" className="monarch-flight"/>
      <ellipse cx="374" cy="504" rx="212" ry="24" fill="url(#pour-floor)" opacity=".54"/>
      <ellipse id="pour-bottle-shadow" cx={rest.x} cy="496" rx="47" ry="10" fill="url(#pour-floor)" opacity=".94"/>
      <ellipse cx="504" cy="505" rx="66" ry="13" fill="url(#pour-floor)"/>

      <g id="bottle" transform={`translate(${rest.x} ${rest.y})`}>
        <image href="/images/malbec-cut.webp" x="-42.55" y="-175" width="85.1" height="370" clipPath="url(#pour-open-bottle)"/>
        <path d="M-17 -171 Q-16 -165 -17 -157 H17 Q16 -165 17 -171 Z" fill="url(#pour-neck)"/>
        <ellipse cy="-171" rx="17.3" ry="4.65" fill="url(#pour-lip)" stroke="#5b554a" strokeWidth=".65"/>
        <ellipse cy="-171.65" rx="13.2" ry="2.85" fill="#171414"/>
        <path d="M-15.5 -171.8 Q-10.4 -175.1 -2 -174.8 M-15 -165.9 Q-12 -164.1 -7.4 -164.4" fill="none" stroke="#e3d0bd" strokeWidth=".9" strokeLinecap="round" opacity=".77"/>
      </g>

      <path d="M493 428 C496 443 496 471 494 485 Q492 494 469 497 Q447 500 443 504 Q453 514 500 514 Q547 514 557 504 Q553 500 531 497 Q508 494 506 485 C504 471 504 443 507 428 Z" fill="url(#pour-glass-foot)" stroke="url(#pour-glass-rim)" strokeWidth="1.15"/>
      <path d="M498 434 C499 453 498 474 498 485 Q497 495 475 499 M503 439 V485 Q504 491 511 494 M447 504 C464 511 533 512 553 504" fill="none" stroke="#fffaf0" strokeWidth="1.5" strokeLinecap="round" opacity=".86"/>
      <path d="M456 509 C477 515 525 515 544 509" fill="none" stroke="#8f7162" strokeWidth="1.1" opacity=".34"/>
      <path d={glass} fill="url(#pour-wall)"/>
      <path d={`M${rightRim} ${rimY} ${backRim}`} fill="none" stroke="url(#pour-glass-rim)" strokeWidth="1.65"/>

      <g id="pour-wine" clipPath="url(#pour-bowl-clip)" opacity="0">
        <rect id="liquid" x={leftBowl} y={rest.surface} width={2 * bowlRadius} height={bowlDepth} fill="url(#pour-wine-body)"/>
        <ellipse cx="495" cy="429" rx="47" ry="10" fill="url(#pour-wine-reflection)" opacity=".56"/>
        <g id="pour-surface">
          <circle r="1" fill="url(#pour-wine-top)"/>
          <g clipPath="url(#pour-surface-clip)">
            <ellipse cx="-.36" cy="-.32" rx=".68" ry=".31" fill="url(#pour-wine-reflection)" opacity=".85"/>
            <ellipse id="pour-impact" cy="0" rx=".18" ry=".18" fill="url(#pour-wine-reflection)" opacity="0"/>
            <circle data-pour-ripple="0" fill="none" stroke="#f5aa9a" strokeWidth=".85" vectorEffect="non-scaling-stroke" opacity="0"/>
            <circle data-pour-ripple=".48" fill="none" stroke="#f5aa9a" strokeWidth=".85" vectorEffect="non-scaling-stroke" opacity="0"/>
          </g>
          <path d="M-1 0 A1 1 0 0 0 1 0" fill="none" stroke="#e4827c" strokeWidth="1.1" vectorEffect="non-scaling-stroke" opacity=".75"/>
        </g>
      </g>

      <path id="pour-stream" fill="url(#pour-jet-color)" opacity="0"/>
      <path id="pour-glint" fill="none" stroke="#ee9985" strokeWidth="1.25" strokeLinecap="round" opacity="0"/>
      <g id="pour-drop" opacity="0">
        <ellipse rx="1.4" ry="2.7" fill="#801b30"/>
        <path d="M-.56 -1.45 Q-.95 -.4 -.68 .75" fill="none" stroke="#f6ac96" strokeWidth=".68" strokeLinecap="round"/>
      </g>

      <path d={bowl} fill="none" stroke="url(#pour-glass-rim)" strokeWidth="1.55"/>
      <path d={frontRim} fill="none" stroke="#8e776b" strokeOpacity=".64" strokeWidth="1.8"/>
      <path d={frontRim} transform="translate(0 -.85)" fill="none" stroke="#fffaf1" strokeOpacity=".86" strokeWidth="1.25"/>
      <path d="M449 337 C441 364 444 387 456 406 Q462 415 470 419 C450 393 449 365 455 339 Z" fill="url(#pour-glass-shine)"/>
      <path d="M550 339 C557 363 558 388 539 411 Q547 389 547 375 Q548 354 544 340 Z" fill="url(#pour-glass-shine)" opacity=".68"/>
      <path d="M452 348 C447 371 450 390 458 403 M544 396 Q536 418 514 427 M467 419 Q484 431 502 429" fill="none" stroke="#fff7e9" strokeWidth="1.3" strokeLinecap="round" opacity=".72"/>
    </svg>
  );
}
