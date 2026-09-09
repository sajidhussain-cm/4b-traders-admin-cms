import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getAbout, getSettings } from "../../lib/publicData";

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()]);
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="section-heading">{about.heading || "Our Story"}</h1>
          <p className="text-charcoal/80 whitespace-pre-line mt-4">{about.description || "Tell your story from the admin dashboard's About Us page."}</p>
        </div>
        {about.image && <img src={about.image} alt="About" className="rounded-sm shadow-lg" />}
      </div>
      <Footer settings={settings} />
    </>
  );
}
