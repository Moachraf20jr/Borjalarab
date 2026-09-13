import { Twitter, Instagram, Facebook } from 'lucide-react'
import { WhatsAppIcon, TikTokIcon } from '../components/SocialIcons'

// Centralized social media configuration.
// - Set the real account URLs here or via env vars (VITE_TIKTOK_URL, VITE_WHATSAPP_NUMBER).
// - Icons are rendered from this list.
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL || 'https://www.tiktok.com'
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '966502331197'

export const socialLinks = [
  { id: 'whatsapp', icon: WhatsAppIcon, label: 'WhatsApp', href: `https://wa.me/${whatsappNumber}` },
  { id: 'tiktok', icon: TikTokIcon, label: 'TikTok', href: tiktokUrl },
  { id: 'twitter', icon: Twitter, label: 'Twitter / X', href: '#' },
  { id: 'instagram', icon: Instagram, label: 'Instagram', href: '#' },
  { id: 'facebook', icon: Facebook, label: 'Facebook', href: '#' }
]

export const CONTACT_INFO = {
  location: 'الخبر - المنطقة الشرقية',
  phone: '+966 50 233 1197',
  phoneHref: 'tel:+966502331197',
  whatsapp: `https://wa.me/${whatsappNumber}`,
  email: 'ebda3.arch@gmail.com',
  emailHref: 'mailto:ebda3.arch@gmail.com'
}