import { Instagram, Facebook } from 'lucide-react'
import { WhatsAppIcon, TikTokIcon, XIcon } from '../components/SocialIcons'

// Centralized social media configuration.
// - Set the real account URLs here or via env vars (VITE_*).
// - Icons are rendered from this list.
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL || 'https://www.tiktok.com/@BorjAlArab97'
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '966502331197'
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/borjalarab97/'
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61594331250876'
const xUrl = import.meta.env.VITE_X_URL || 'https://x.com/BorjAlArab97'

export const socialLinks = [
  { id: 'whatsapp', icon: WhatsAppIcon, label: 'WhatsApp', href: `https://wa.me/${whatsappNumber}` },
  { id: 'tiktok', icon: TikTokIcon, label: 'TikTok', href: tiktokUrl },
  { id: 'instagram', icon: Instagram, label: 'Instagram', href: instagramUrl },
  { id: 'facebook', icon: Facebook, label: 'Facebook', href: facebookUrl },
  { id: 'x', icon: XIcon, label: 'X', href: xUrl }
]

export const CONTACT_INFO = {
  location: 'الخبر - المنطقة الشرقية',
  phone: '+966 50 233 1197',
  phoneHref: 'tel:+966502331197',
  whatsapp: `https://wa.me/${whatsappNumber}`,
  email: 'ebda3.arch@gmail.com',
  emailHref: 'mailto:ebda3.arch@gmail.com'
}
