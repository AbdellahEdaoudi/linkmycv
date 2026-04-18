'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MyContext } from '../../Context/MyContext'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, MessageSquare, Phone, Trash2, X } from "lucide-react"

export default function ContactsPage() {
  const [error, setError] = useState(null)
  const { SERVER_URL_V } = useContext(MyContext)
  const [contacts, setContacts] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchContacts = async () => {
        try {
            const response = await axios.get(`/api/proxy/admin/contacts`);
            setContacts(response.data);
        } catch (error) {
          if (error.response && error.response.status === 403) {
            alert("Your session has expired. Please log in again.");
            router.push("/Login");
          } else {
            console.log(error);
          }
        }
    };
    fetchContacts();
  }, [SERVER_URL_V, router]);


  const DeleteMessage = async (id) => {
    try {
        await axios.delete(`/api/proxy/admin/contacts/${id}`);
        setContacts(contacts.filter(contact => contact._id !== id));
        setDeleteConfirmId(null);
    } catch (error) {
        setError({ message: "Error deleting contact" });
    }
  };


  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500">
      <p>Error: {error.message}</p>
    </div>
  )

  return (
    <section className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Admin Contacts</h1>
        <p className="text-gray-500">Manage incoming messages from users.</p>
      </div>

      {/* Mobile View */}
      <div className="grid gap-4 grid-cols-1 md:hidden">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">ID: {contact.iduser}</span>
              <button 
                onClick={() => setDeleteConfirmId(contact._id)}
                className="p-2 text-red-500 hover:bg-red-50 hover:rounded-full transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-gray-400" />
                <span className="text-sm truncate">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-gray-400" />
                <span className="text-sm">{contact.phoneNumber || 'N/A'}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedMessage(contact)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors"
            >
              <MessageSquare size={14} /> View Message
            </button>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border bg-white shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">User ID</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Message</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 font-mono text-xs text-gray-400">{contact.iduser}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" />
                    <span className="font-medium text-gray-700">{contact.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-green-500" />
                    <span>{contact.phoneNumber || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => setSelectedMessage(contact)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Read Message
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setDeleteConfirmId(contact._id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <MessageSquare className="text-indigo-500" /> Message from {selectedMessage.email}
              </h2>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="mb-6 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Contact Details</p>
                <p className="text-gray-700"><strong>Email:</strong> {selectedMessage.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {selectedMessage.phoneNumber || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed italic">
                  "{selectedMessage.message}"
                </p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-800">Delete Contact?</h2>
              <p className="text-gray-500">This action cannot be undone. Are you sure you want to permanently remove this message?</p>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => DeleteMessage(deleteConfirmId)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}