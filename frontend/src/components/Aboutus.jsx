import React from "react";

const Aboutus = () => {
  return (
    <div className=" mt-10 flex flex-col items-center p-6 sm:p-12 bg-black text-white">
      {/* Header */}
      <section className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl font-bold mb-6">About Our Project</h1>
        <p className="text-lg text-white">
          Learn more about our journey, efforts, and the mission that drives our work forward.
        </p>
      </section>

      {/* Project Background */}
      <section className="mb-10 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Project Background</h2>
        <p className="text-white leading-relaxed">
          Our project is designed to address [add the specific problem or opportunity]. By leveraging technology, we aim to [describe the project’s purpose, how it began, and any initial inspiration]. Through this, we hope to make a meaningful impact on [mention your target area/industry/community].
        </p>
      </section>

      {/* Our Efforts */}
      <section className="mb-10 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Our Efforts</h2>
        <p className="text-white leading-relaxed">
          We are committed to putting in our best efforts to ensure the success of this project. Our team works diligently on [list specific areas like research, development, or design], striving to create solutions that are both effective and sustainable. Each step, from initial ideation to final execution, is done with a focus on [mention core values like quality, innovation, or community impact].
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-4xl">
        <div className="p-6 border shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
          <p className="text-white leading-relaxed">
            To empower [target audience] by providing [describe the value your project offers]. We aim to bridge the gap in [mention any identified gap in the industry/community] by creating tools that are [mention qualities like accessible, innovative, user-friendly].
          </p>
        </div>
        <div className="p-6 border shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
          <p className="text-white leading-relaxed">
            We envision a future where [describe your long-term vision related to the industry or target area]. Our goal is to [mention how you plan to impact the industry/community], fostering a culture of [mention your core values, like innovation, sustainability, collaboration].
          </p>
        </div>
      </section>

      {/* Goals Section */}
      <section className="mb-10 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Our Goals</h2>
        <ul className="list-disc list-inside text-white leading-relaxed">
          <li>To [specific goal #1, e.g., develop user-friendly tools that meet industry standards].</li>
          <li>To [specific goal #2, e.g., raise awareness about issues related to your project].</li>
          <li>To [specific goal #3, e.g., provide educational resources for continuous improvement].</li>
        </ul>
      </section>

      {/* Closing Statement */}
      <section className="text-center max-w-3xl">
        <p className="text-white leading-relaxed">
          We are excited to continue this journey, and we’re grateful for the support of our community and stakeholders. Together, we can make a positive impact and drive meaningful change.
        </p>
      </section>
    </div>
  );
};

export default Aboutus;
