import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Stepper from "@/components/Stepper";

// TODO: placeholder years and events. Replace with the client's real milestones.
const MILESTONES = [
  { title: "2014", text: "Our founder starts buying rajma and red rice from five farming families in one village." },
  { title: "2016", text: "A small unit opens in the hills to clean, sort and pack each harvest by hand." },
  { title: "2018", text: "Our partner farms receive organic certification." },
  { title: "2020", text: "The network grows past 200 farmers across the hill districts." },
  { title: "2022", text: "Hill snacks and wafers join the range for home kitchens." },
  { title: "2024", text: "Bulk supply begins for hotels, restaurants and retailers." },
];

export default function Milestones() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="lg:mx-auto lg:max-w-2xl lg:text-center">
          <SectionHeading eyebrow="Our story so far" title="A decade of growing slowly">
            From one village to hundreds of farms, one harvest at a time.
          </SectionHeading>
        </Reveal>
        <Stepper variant="draw" steps={MILESTONES} className="mt-16 lg:mt-24" />
      </div>
    </section>
  );
}
