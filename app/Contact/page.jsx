"use client";

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MyContext } from '../Context/MyContext';
import { toast } from '../Components/toast';
import { CheckCheck, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import ParticleComponent from '../Components/ParticleComponent';
import WarningModal from "./Pages/WarningModal"

export default function ContactForm() {
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [iduser, setIduser] = useState('')
  const [loading, setLoading] = useState(false)
  const { userDetails, EmailUser, SERVER_URL_V, contacts, setContacts } = useContext(MyContext)
  
  useEffect(() => {
    const user = userDetails.find(user => user.email === EmailUser)
    if (user) {
      setEmail(user.email || "")
      setPhoneNumber(user.phoneNumber || "")
      setIduser(user._id || "")
    }
  }, [userDetails, EmailUser])  

  const sendContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    const regex = /<script.*?>.*?<\/script>|<iframe.*?>.*?<\/iframe>|javascript:|eval\(|alert\(|document\.cookie|window\.location|<a\s+href=["']?javascript:.*?["']?/i;

    if (regex.test(phoneNumber) || regex.test(message)) {
      setLoading(false)
        document.getElementById('my_modal_2').showModal();
        return;
    }
    try {
      await axios.post(`/api/proxy/contacts`, { iduser,email,phoneNumber, message });
      toast.success("Message sent successfully!");
      setMessage('')
    } catch (error) {
      console.error('Error adding contact:', error)
      if (error.response && error.response.status === 429) {
        toast.error('Too many requests! Please try again later.')
      } else {
        toast.error('An error occurred while sending the message.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 ">
        <ParticleComponent bgcolor={"bg-gradient-to-br from-teal-950 to-teal-950"}  />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2 bg-teal-800 p-4 lg:p-12">
              <h2 className="text-4xl font-bold text-white mb-8">Get in Touch</h2>
              <p className="text-teal-100 mb-10 text-lg leading-relaxed">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              <div className="space-y-6">
                <div className="flex items-center text-teal-100 group">
                  <div className="p-3 bg-teal-700/50 rounded-full mr-4 group-hover:bg-teal-600 transition-colors">
                    <Mail className="h-6 w-6" />
                  </div>
                  <span className="text-lg">linkerfolio@gmail.com</span>
                </div>
                <div className="flex items-center text-teal-100 group">
                  <div className="p-3 bg-teal-700/50 rounded-full mr-4 group-hover:bg-teal-600 transition-colors">
                    <Phone className="h-6 w-6" />
                  </div>
                  <span className="text-lg">+212 609085357</span>
                </div>
                <div className="flex items-center text-teal-100 group">
                  <div className="p-3 bg-teal-700/50 rounded-full mr-4 group-hover:bg-teal-600 transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <span className="text-lg">El-Aaiun, Morocco</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-teal-900 mb-8">Send a Message</h2>
              <form onSubmit={sendContact} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-teal-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 pr-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 w-full transition-all outline-none"
                      placeholder="name@example.com"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-semibold text-teal-700 mb-2">Phone Number (Optional)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 pr-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 w-full transition-all outline-none"
                      placeholder="+212 ..."
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-teal-700 mb-2">Your Message</label>
                  <div className="relative">
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pl-12 pr-4 pt-3 pb-3 border-2 border-teal-100 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 w-full transition-all outline-none"
                      rows={5}
                      placeholder="How can we help you?"
                      required
                    />
                    <MessageSquare className="absolute left-4 top-4 text-teal-600 h-5 w-5" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-800 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-teal-900/20 hover:from-teal-700 hover:to-teal-900 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
              <WarningModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}