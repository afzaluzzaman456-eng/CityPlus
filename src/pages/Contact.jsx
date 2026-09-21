import {
    FiClock,
    FiGlobe,
    FiMail,
    FiMapPin,
    FiMessageCircle,
    FiPhone,
    FiSend,
} from "react-icons/fi";

function Contact() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">
            <div className="max-w-7xl mx-auto page-enter">

                {/* ================= HERO ================= */}
                <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-city-lg">

                    {/* Background Decoration */}
                    <div className="absolute -top-16 sm:-top-24 -right-16 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-2xl float-slow"></div>

                    <div className="absolute -bottom-20 sm:-bottom-32 -left-16 sm:-left-20 w-56 h-56 sm:w-80 sm:h-80 bg-cyan-300/20 rounded-full blur-3xl"></div>

                    <div className="relative px-5 sm:px-8 md:px-10 lg:px-14 py-10 sm:py-14 md:py-16">

                        <div className="max-w-3xl">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm mb-4 sm:mb-5">
                                <FiMessageCircle size={16} />
                                Contact CityPulse
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                We're Here to

                                <span className="block text-cyan-100">
                                    Hear From You
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-white/85 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 mt-4 sm:mt-5 max-w-2xl">
                                Have a question, suggestion or need help with the platform?
                                Get in touch with the CityPulse team.
                            </p>

                        </div>
                    </div>
                </section>


                {/* ================= CONTACT INFO + FORM ================= */}
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 mt-6 sm:mt-8">

                    {/* ================= CONTACT INFORMATION ================= */}
                    <div className="lg:col-span-2 space-y-5">

                        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-city-lg p-5 sm:p-7">

                            <h2 className="text-2xl font-bold text-slate-900">
                                Get in Touch
                            </h2>

                            <p className="text-slate-500 text-sm leading-6 mt-3">
                                Our team is always interested in hearing from citizens,
                                communities and organizations.
                            </p>


                            {/* Email */}
                            <div className="flex items-start gap-3 sm:gap-4 mt-6 sm:mt-7">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FiMail size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Email
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500 mt-1 break-all">
                                        afzaluzzaman456@gmail.com
                                    </p>
                                </div>

                            </div>


                            {/* Phone */}
                            <div className="flex items-start gap-3 sm:gap-4 mt-5 sm:mt-6">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                    <FiPhone size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Phone
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        +880 1841973258
                                    </p>
                                </div>

                            </div>


                            {/* Location */}
                            <div className="flex items-start gap-3 sm:gap-4 mt-5 sm:mt-6">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FiMapPin size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Location
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Dhaka, Bangladesh
                                    </p>
                                </div>

                            </div>


                            {/* Hours */}
                            <div className="flex items-start gap-3 sm:gap-4 mt-5 sm:mt-6">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <FiClock size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Support Hours
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Saturday – Thursday
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500">
                                        9:00 AM – 6:00 PM
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* ================= SMALL INFO CARD ================= */}
                        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-city-lg">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-white/10 text-cyan-300 flex items-center justify-center">
                                    <FiGlobe size={20} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm sm:text-base">
                                        Connected Community
                                    </h3>

                                    <p className="text-white/55 text-xs mt-1">
                                        Your feedback helps improve CityPulse.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= CONTACT FORM ================= */}
                    <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-city-lg p-5 sm:p-7 md:p-9">

                        <div className="mb-6 sm:mb-7">

                            <span className="text-xs sm:text-sm font-semibold text-blue-600">
                                SEND A MESSAGE
                            </span>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                                How can we help?
                            </h2>

                            <p className="text-slate-500 text-xs sm:text-sm mt-2">
                                Fill out the form and we'll get back to you.
                            </p>

                        </div>


                        <form className="space-y-4 sm:space-y-5">

                            {/* Name */}
                            <div>

                                <label className="label">
                                    <span className="label-text font-semibold text-sm">
                                        Your Name
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="input input-bordered w-full rounded-xl text-sm sm:text-base"
                                />

                            </div>


                            {/* Email */}
                            <div>

                                <label className="label">
                                    <span className="label-text font-semibold text-sm">
                                        Email Address
                                    </span>
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full rounded-xl text-sm sm:text-base"
                                />

                            </div>


                            {/* Subject */}
                            <div>

                                <label className="label">
                                    <span className="label-text font-semibold text-sm">
                                        Subject
                                    </span>
                                </label>

                                <select
                                    className="select select-bordered w-full rounded-xl text-sm sm:text-base"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>

                                    <option value="general">
                                        General Question
                                    </option>

                                    <option value="technical">
                                        Technical Support
                                    </option>

                                    <option value="feedback">
                                        Feedback
                                    </option>

                                    <option value="complaint">
                                        Platform Complaint
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>
                                </select>

                            </div>


                            {/* Message */}
                            <div>

                                <label className="label">
                                    <span className="label-text font-semibold text-sm">
                                        Message
                                    </span>
                                </label>

                                <textarea
                                    placeholder="Write your message..."
                                    className="textarea textarea-bordered w-full min-h-32 sm:min-h-36 rounded-xl resize-none text-sm sm:text-base"
                                ></textarea>

                            </div>


                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary w-full rounded-xl text-sm sm:text-base"
                            >
                                <FiSend size={18} />
                                Send Message
                            </button>

                        </form>

                    </div>

                </section>


                {/* ================= BOTTOM SECTION ================= */}
                <section className="text-center py-10 sm:py-12">

                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-600 pulse-glow mb-4 sm:mb-5">
                        <FiMessageCircle size={23} />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Have something to share?
                    </h2>

                    <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mt-3 px-3">
                        Your questions, suggestions and feedback help us make
                        CityPulse better for everyone.
                    </p>

                </section>

            </div>
        </div>
    );
}

export default Contact;