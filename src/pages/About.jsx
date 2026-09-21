import {
    FiActivity,
    FiCheckCircle,
    FiGlobe,
    FiHeart,
    FiMapPin,
    FiShield,
    FiUsers,
    FiZap,
} from "react-icons/fi";

function About() {
    const features = [
        {
            icon: <FiMapPin size={24} />,
            title: "Report Local Issues",
            description:
                "Citizens can easily report problems such as roads, garbage, drainage, street lights and other city issues.",
        },
        {
            icon: <FiActivity size={24} />,
            title: "Track Progress",
            description:
                "Keep track of submitted complaints and service requests from submission to resolution.",
        },
        {
            icon: <FiShield size={24} />,
            title: "Secure Platform",
            description:
                "Authentication and role-based access help keep user information and city data protected.",
        },
        {
            icon: <FiZap size={24} />,
            title: "Faster Response",
            description:
                "A centralized platform helps organize requests and makes it easier for administrators to manage them.",
        },
    ];

    const values = [
        {
            icon: <FiUsers size={22} />,
            title: "Community First",
            description:
                "We focus on creating a better connection between citizens and city services.",
        },
        {
            icon: <FiCheckCircle size={22} />,
            title: "Transparency",
            description:
                "Users can clearly see the status and progress of their submitted requests.",
        },
        {
            icon: <FiHeart size={22} />,
            title: "Better Living",
            description:
                "Small improvements in local services can make everyday city life easier.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">
            <div className="max-w-7xl mx-auto page-enter">

                {/* ================= HERO ================= */}
                <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-city-lg">

                    <div className="absolute -top-16 sm:-top-24 -right-16 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-2xl float-slow"></div>

                    <div className="absolute -bottom-20 sm:-bottom-32 -left-16 sm:-left-20 w-56 h-56 sm:w-80 sm:h-80 bg-cyan-300/20 rounded-full blur-3xl"></div>

                    <div className="relative px-5 sm:px-8 md:px-10 lg:px-14 py-10 sm:py-14 md:py-16 lg:py-20">

                        <div className="max-w-3xl">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm mb-4 sm:mb-5">
                                <FiGlobe size={16} />
                                About CityPulse
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Making Cities
                                <span className="block text-cyan-100">
                                    Better Together
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-white/85 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 mt-4 sm:mt-6 max-w-2xl">
                                CityPulse is a digital platform that connects citizens
                                with city services. It makes reporting problems,
                                requesting services and tracking progress simple,
                                transparent and accessible.
                            </p>

                        </div>
                    </div>
                </section>

                {/* ================= MISSION ================= */}
                <section className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

                    {/* Mission */}
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg p-5 sm:p-7 md:p-9">

                        <div className="absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-40 h-40 sm:w-52 sm:h-52 bg-blue-100/60 rounded-full blur-3xl"></div>

                        <div className="relative">

                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 sm:mb-5">
                                <FiActivity size={23} />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Our Mission
                            </h2>

                            <p className="text-slate-600 text-sm sm:text-base leading-6 sm:leading-7 mt-3 sm:mt-4">
                                Our mission is to make communication between citizens
                                and city authorities easier. CityPulse provides a
                                centralized place where people can submit complaints,
                                request essential services and monitor their progress.
                            </p>

                            <p className="text-slate-600 text-sm sm:text-base leading-6 sm:leading-7 mt-3 sm:mt-4">
                                By bringing these services together in one platform,
                                CityPulse aims to encourage community participation
                                and help create cleaner, safer and more responsive
                                cities.
                            </p>

                        </div>
                    </div>

                    {/* Built for Citizens */}
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg p-5 sm:p-7 md:p-9">

                        <div className="absolute -bottom-16 sm:-bottom-20 -left-16 sm:-left-20 w-40 h-40 sm:w-52 sm:h-52 bg-cyan-100/60 rounded-full blur-3xl"></div>

                        <div className="relative">

                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4 sm:mb-5">
                                <FiUsers size={23} />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Built for Citizens
                            </h2>

                            <p className="text-slate-600 text-sm sm:text-base leading-6 sm:leading-7 mt-3 sm:mt-4">
                                CityPulse is designed with simplicity in mind. Citizens
                                should not need complicated processes to report an
                                issue or request a service.
                            </p>

                            <p className="text-slate-600 text-sm sm:text-base leading-6 sm:leading-7 mt-3 sm:mt-4">
                                From creating a request to checking its current status,
                                everything is organized in one easy-to-use interface.
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-6">

                                <span className="badge badge-primary px-3 sm:px-4 py-3 text-xs sm:text-sm">
                                    Easy to Use
                                </span>

                                <span className="badge badge-info px-3 sm:px-4 py-3 text-xs sm:text-sm">
                                    Transparent
                                </span>

                                <span className="badge badge-success px-3 sm:px-4 py-3 text-xs sm:text-sm">
                                    Community Driven
                                </span>

                            </div>

                        </div>
                    </div>

                </section>

                {/* ================= FEATURES ================= */}
                <section className="mt-8 sm:mt-10">

                    <div className="text-center mb-6 sm:mb-7">

                        <span className="text-xs sm:text-sm font-semibold text-blue-600">
                            WHAT WE OFFER
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                            Everything in One Place
                        </h2>

                        <p className="text-sm sm:text-base text-slate-500 mt-2 sm:mt-3 max-w-2xl mx-auto px-2">
                            CityPulse brings important citizen services together
                            through one simple and organized platform.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="stagger-item group bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-city-lg hover:-translate-y-2 transition-all duration-300"
                            >

                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    {feature.icon}
                                </div>

                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-4 sm:mt-5">
                                    {feature.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-500 leading-6 mt-2 sm:mt-3">
                                    {feature.description}
                                </p>

                            </div>
                        ))}

                    </div>

                </section>

                {/* ================= VALUES ================= */}
                <section className="mt-8 sm:mt-10">

                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 text-white shadow-city-lg">

                        <div className="absolute -top-24 sm:-top-32 -right-16 sm:-right-20 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-24 sm:-bottom-32 -left-16 sm:-left-20 w-60 h-60 sm:w-80 sm:h-80 bg-cyan-500/15 rounded-full blur-3xl"></div>

                        <div className="relative p-5 sm:p-7 md:p-10">

                            <div className="text-center mb-6 sm:mb-8">

                                <span className="text-xs sm:text-sm font-semibold text-cyan-300">
                                    OUR VALUES
                                </span>

                                <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                                    What CityPulse Stands For
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

                                {values.map((value) => (
                                    <div
                                        key={value.title}
                                        className="glass-hover bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6"
                                    >

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 text-cyan-300 flex items-center justify-center">
                                            {value.icon}
                                        </div>

                                        <h3 className="font-bold text-base sm:text-lg mt-4 sm:mt-5">
                                            {value.title}
                                        </h3>

                                        <p className="text-white/65 text-xs sm:text-sm leading-6 mt-2">
                                            {value.description}
                                        </p>

                                    </div>
                                ))}

                            </div>

                        </div>
                    </div>

                </section>

                {/* ================= BOTTOM CTA ================= */}
                <section className="mt-8 sm:mt-10 text-center pb-5 sm:pb-6">

                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-600 pulse-glow mb-4 sm:mb-5">
                        <FiMapPin size={24} />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Your City. Your Voice.
                    </h2>

                    <p className="text-sm sm:text-base text-slate-500 mt-2 sm:mt-3 max-w-xl mx-auto px-3">
                        Together, citizens and city authorities can work toward
                        building better and more responsive communities.
                    </p>

                </section>

            </div>
        </div>
    );
}

export default About;