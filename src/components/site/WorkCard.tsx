import googleLogo from "@/assets/work-brands/google.svg";
import ifoodLogo from "@/assets/work-brands/ifood.svg";
import netflixLogo from "@/assets/work-brands/netflix.svg";
import nextLogo from "@/assets/work-brands/next.svg";
import quqoLogo from "@/assets/work-brands/quqo.svg";

type CaseStudy = {
  tag: string;
  title: string;
  result: string;
  body: string;
};

const brands = [
  { name: "Quqo", logo: quqoLogo, tone: "quqo" },
  { name: "iFood", logo: ifoodLogo, tone: "ifood" },
  { name: "iFood", logo: ifoodLogo, tone: "ifood" },
  { name: "Google", logo: googleLogo, tone: "google" },
  { name: "Netflix", logo: netflixLogo, tone: "netflix" },
  { name: "Bradesco Next", logo: nextLogo, tone: "next" },
] as const;

type WorkCardProps = {
  caseStudy: CaseStudy;
  index: number;
  revealLabel: string;
  returnLabel: string;
};

export function WorkCard({ caseStudy, index, revealLabel, returnLabel }: WorkCardProps) {
  const brand = brands[index];

  if (!brand) return null;

  return (
    <article className="work-editorial" data-brand={brand.tone}>
      <div className="work-editorial-brand">
        <img className="work-card-logo" src={brand.logo} alt={brand.name} />
      </div>
      <div className="work-editorial-copy">
        <p className="eyebrow work-card-tag">{caseStudy.tag}</p>
        <h3>{caseStudy.title}</h3>
        <p className="work-editorial-result">{caseStudy.result}</p>
        <p className="work-editorial-body">{caseStudy.body}</p>
      </div>
    </article>
  );
}