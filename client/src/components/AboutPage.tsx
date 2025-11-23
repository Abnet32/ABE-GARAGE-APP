import React from "react";
import PageHeader from "./PageHeader";
import { ArrowRight } from "lucide-react";
import nine from '../assets/9.avif';
import ten from '../assets/10.avif';

interface AboutPageProps {
  onNavigate: (view: any, sectionId?: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <section className="min-h-screen bg-white">
      <PageHeader title="About Us" breadcrumb="About Us" />

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Grid Left */}
          <div className="lg:w-1/2 relative">
            <div className="flex gap-4 h-[450px]">
              <div className="w-1/2 h-full bg-gray-200 relative overflow-hidden group">
                <img
                  src={nine}
                  alt="Oil change"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="w-1/2 h-3/4 self-end bg-gray-300 relative overflow-hidden group">
                <img
                  src={ten}
                  alt="Car Service"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            </div>
            {/* Years Experience Badge */}
            <div className="absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[20%] bg-white p-2 shadow-xl z-10">
              <div className="border-2 border-brand-red/20 p-6 text-center bg-white min-w-[140px]">
                <span className="block text-5xl font-black text-brand-red font-heading leading-none">
                  24
                </span>
                <span className="block text-2xs font-bold text-brand-red tracking-widest mt-1">
                  YEARS
                </span>
                <span className="block text-[14px] font-bold text-brand-red tracking-wide uppercase">
                  Experience
                </span>
              </div>
            </div>
          </div>

          {/* Text Content Right */}
          <div className="lg:w-1/2 pt-8 lg:pl-10">
            <span className="text-sm text-gray-600 font-medium mb-2 block">
              Welcome to Our workshop
            </span>
            <h3 className="text-4xl font-bold text-brand-blue mb-6 font-heading">
              We have 24 years experience
            </h3>

            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              At Abe Garage, we bring table win-win survival strategies to
              ensure proactive domination. At the end of the day, going forward,
              a new normal that has evolved from generation X is on the runway
              heading towards a streamlined cloud solution.
            </p>

            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
              Capitalize on low hanging fruit to identify a ballpark value added
              activity to beta test. Override the digital divide with additional
              clickthroughs from DevOps. Nanotechnology immersion along the
              information highway will close the loop on focusing.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-4 border-brand-red pl-4">
                <h4 className="font-bold text-brand-blue font-heading text-lg">
                  Mission
                </h4>
                <p className="text-xs text-gray-500 mt-2">
                  To provide the best automotive service with transparency and
                  trust.
                </p>
              </div>
              <div className="border-l-4 border-brand-blue pl-4">
                <h4 className="font-bold text-brand-blue font-heading text-lg">
                  Vision
                </h4>
                <p className="text-xs text-gray-500 mt-2">
                  To be the most trusted mechanic workshop in the entire state.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("services")}
              className="bg-brand-red text-white px-8 py-3 text-xs font-bold tracking-widest flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              VIEW SERVICES <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
