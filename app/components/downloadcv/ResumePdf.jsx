import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font, Svg, Path } from '@react-pdf/renderer';
import { CV_UI_TRANSLATIONS } from '../../utils/translation';

// Register standard fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammT.ttf', fontWeight: 'bold' },
    { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLoHQiA8.ttf', fontStyle: 'italic' }
  ]
});

Font.register({
  family: 'Vazirmatn',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Bold.ttf', fontWeight: 'bold' }
  ]
});

Font.register({
  family: 'Noto Sans JP',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf' },
    { src: 'https://fonts.gstatic.com/s/notosansjp/v55/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf', fontWeight: 'bold' }
  ]
});

Font.register({
  family: 'Noto Sans SC',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf' },
    { src: 'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGzjCnYw.ttf', fontWeight: 'bold' }
  ]
});

// Crisp Vector SVG Icons for Header
const PinIcon = ({ isRTL }) => (
  <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
    <Path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);

const PhoneIcon = ({ isRTL }) => (
  <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
    <Path fill="#16A34A" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </Svg>
);

const MailIcon = ({ isRTL }) => (
  <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
    <Path fill="#2563EB" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </Svg>
);

const GlobeIcon = ({ isRTL }) => (
  <Svg width={7} height={7} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
    <Path fill="#0891B2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </Svg>
);

const GithubIcon = ({ isRTL }) => (
  <Svg width={7.5} height={7.5} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
    <Path fill="#181717" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </Svg>
);

const LinkedinIcon = ({ isRTL }) => (
  <Svg width={7.5} height={7.5} viewBox="0 0 24 24" style={{ marginRight: isRTL ? 0 : 2.5, marginLeft: isRTL ? 2.5 : 0, alignSelf: 'center' }}>
    <Path fill="#0A66C2" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </Svg>
);

// Professional Executive Palette
const COLORS = {
  name: '#0F172A',         // dark slate/black
  title: '#1D4ED8',        // royal blue as shown in sample
  body: '#1F2937',         // crisp dark body text
  muted: '#64748B',        // secondary text/dates
  hairline: '#CBD5E1',     // dividers
  border: '#E2E8F0',       // section borders
  tagBg: '#F1F5F9',        // subtle slate tag background
  tagBorder: '#CBD5E1',
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 30,
    fontSize: 8.5,
    lineHeight: 1.35,
    color: COLORS.body,
  },

  // ---------- HEADER (Matches Reference Image) ----------
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.name,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
    lineHeight: 1.15,
  },
  title: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: COLORS.title,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 3,
  },
  contactItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItem: {
    fontSize: 8,
    color: COLORS.body,
  },
  contactLink: {
    fontSize: 8,
    color: COLORS.name,
    textDecoration: 'underline',
  },
  separator: {
    fontSize: 8,
    color: COLORS.hairline,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 62,
    height: 72,
    borderRadius: 6,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },

  // ---------- SECTION (Compact 1-Page Layout) ----------
  section: {
    marginBottom: 7,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: COLORS.name,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    letterSpacing: 0.4,
  },
  summaryText: {
    fontSize: 8.5,
    color: COLORS.body,
    textAlign: 'justify',
    lineHeight: 1.4,
  },

  // ---------- ENTRIES ----------
  entry: {
    marginBottom: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  entryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.name,
  },
  entryDate: {
    fontSize: 8,
    color: COLORS.muted,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: COLORS.title,
    marginTop: 0.5,
    marginBottom: 1.5,
  },
  entryDesc: {
    fontSize: 8,
    color: COLORS.body,
    lineHeight: 1.35,
    paddingLeft: 4,
    borderLeftWidth: 1.5,
    borderLeftColor: COLORS.hairline,
    marginTop: 1.5,
  },

  // ---------- SKILLS TAGS ----------
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: COLORS.name,
    backgroundColor: COLORS.tagBg,
    borderWidth: 0.5,
    borderColor: COLORS.tagBorder,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 3.5,
  },

  // ---------- LANGUAGES ----------
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  langText: {
    fontSize: 8,
    color: COLORS.body,
    lineHeight: 1.35,
  },
});

// RTL overrides for Arabic
const rtlStyles = StyleSheet.create({
  page: { direction: 'rtl' },
  header: { flexDirection: 'row-reverse' },
  headerLeft: { paddingRight: 0, paddingLeft: 14 },
  name: { textAlign: 'right' },
  title: { textAlign: 'right' },
  contactRow: { flexDirection: 'row-reverse' },
  sectionTitle: { textAlign: 'right' },
  summaryText: { textAlign: 'right' },
  entryHeader: { flexDirection: 'row-reverse' },
  entryTitle: { textAlign: 'right' },
  entrySubtitle: { textAlign: 'right' },
  entryDesc: { textAlign: 'right', paddingLeft: 0, paddingRight: 4, borderLeftWidth: 0, borderRightWidth: 1.5, borderRightColor: COLORS.hairline },
  tagRow: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
  tag: { marginRight: 0, marginLeft: 4 },
  langText: { textAlign: 'right' },
});

export default function ResumePdf({ userData, currentLang = 'en' }) {
  const isRTL = currentLang === 'ar';
  const ui = CV_UI_TRANSLATIONS[currentLang] || CV_UI_TRANSLATIONS.en;

  const getFontFamily = (lang) => {
    switch (lang) {
      case 'ar': return 'Vazirmatn';
      case 'ja': return 'Noto Sans JP';
      case 'zh': return 'Noto Sans SC';
      default: return 'Roboto';
    }
  };

  const fontFamily = getFontFamily(currentLang);

  const s = (styleName, extra = {}) => {
    const base = styles[styleName];
    const rtl = isRTL ? rtlStyles[styleName] : {};
    return [base, rtl, extra];
  };

  const formatDateDisplay = (date, yearOnly = false) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return String(date);
      const locale = isRTL ? 'ar-EG' : 'en-US';
      return yearOnly
        ? d.toLocaleDateString(locale, { year: 'numeric' })
        : d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
    } catch {
      return String(date);
    }
  };

  // Clean social link labels
  const cleanLinkText = (url) => {
    if (!url || typeof url !== 'string') return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  };

  // Extract skills array
  const skills = Array.isArray(userData?.skillsList)
    ? userData.skillsList.map(s => (typeof s === 'object' ? s.name : s)).filter(Boolean)
    : Array.isArray(userData?.skills)
      ? userData.skills.map(s => (typeof s === 'object' ? s.name : s)).filter(Boolean)
      : [];

  // Extract languages array
  const languages = Array.isArray(userData?.languagesList)
    ? userData.languagesList.map(l => {
      if (typeof l === 'object') {
        const name = l.language || l.name || '';
        const level = l.level || l.proficiency || '';
        return level ? `${name} (${level})` : name;
      }
      return String(l);
    }).filter(Boolean)
    : [];

  // Dynamic professional metadata: Full Name — Specialization (e.g. Abdellah Edaoudi — Full Stack Web Developer)
  const cleanFullName = (userData?.fullname || '').trim();
  const cleanSpecialization = (userData?.specialization || '').trim();
  const docTitle = cleanSpecialization
    ? `${cleanFullName} — ${cleanSpecialization}`
    : cleanFullName
      ? `${cleanFullName} — CV`
      : 'Curriculum Vitae';
  const docAuthor = cleanFullName || 'Curriculum Vitae';

  const nameFontFamily = isRTL
    ? 'Vazirmatn'
    : currentLang === 'ja'
      ? 'Noto Sans JP'
      : currentLang === 'zh'
        ? 'Noto Sans SC'
        : 'Times-Bold';

  // Contact items for Row 1
  const contactRow1 = [];
  if (userData?.country) {
    contactRow1.push({ key: 'loc', icon: PinIcon, type: 'text', val: userData.country });
  }
  if (userData?.phoneNumber) {
    contactRow1.push({ key: 'phone', icon: PhoneIcon, type: 'text', val: userData.phoneNumber });
  }
  if (userData?.email) {
    contactRow1.push({ key: 'email', icon: MailIcon, type: 'link', val: userData.email, href: `mailto:${userData.email}` });
  }
  if (userData?.socials?.portfolio) {
    contactRow1.push({ key: 'portfolio', icon: GlobeIcon, type: 'link', val: cleanLinkText(userData.socials.portfolio), href: userData.socials.portfolio });
  }

  // Contact items for Row 2 (Social profiles)
  const contactRow2 = [];
  if (userData?.socials?.github) {
    contactRow2.push({ key: 'github', icon: GithubIcon, type: 'link', val: cleanLinkText(userData.socials.github), href: userData.socials.github });
  }
  if (userData?.socials?.linkedin) {
    contactRow2.push({ key: 'linkedin', icon: LinkedinIcon, type: 'link', val: cleanLinkText(userData.socials.linkedin), href: userData.socials.linkedin });
  }

  return (
    <Document
      title={docTitle}
      author={docAuthor}
      subject={docTitle}
      creator={docAuthor}
      producer=""
    >
      <Page size="A4" style={[styles.page, { fontFamily }, isRTL ? rtlStyles.page : {}]}>

        {/* ── HEADER (Reference Image Layout) ── */}
        <View style={s('header')}>
          <View style={s('headerLeft')}>
            <Text style={[styles.name, { fontFamily: nameFontFamily }, isRTL ? rtlStyles.name : {}]}>
              {userData?.fullname || 'Curriculum Vitae'}
            </Text>
            {userData?.specialization ? (
              <Text style={s('title')}>{userData.specialization}</Text>
            ) : null}

            {/* Contact Row 1 (Location | Phone | Email | Portfolio) */}
            {contactRow1.length > 0 && (
              <View style={s('contactRow')}>
                {contactRow1.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <React.Fragment key={item.key || idx}>
                      {idx > 0 && <Text style={styles.separator}>|</Text>}
                      <View style={[styles.contactItemWrapper, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
                        {IconComp && <IconComp isRTL={isRTL} />}
                        {item.type === 'link' ? (
                          <Link src={item.href} style={styles.contactLink}>{item.val}</Link>
                        ) : (
                          <Text style={styles.contactItem}>{item.val}</Text>
                        )}
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            )}

            {/* Contact Row 2 (GitHub | LinkedIn) */}
            {contactRow2.length > 0 && (
              <View style={s('contactRow')}>
                {contactRow2.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <React.Fragment key={item.key || idx}>
                      {idx > 0 && <Text style={styles.separator}>|</Text>}
                      <View style={[styles.contactItemWrapper, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
                        {IconComp && <IconComp isRTL={isRTL} />}
                        <Link src={item.href} style={styles.contactLink}>{item.val}</Link>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            )}
          </View>

          {/* Profile Photo - Rounded Rectangle on the Right */}
          {userData?.profileImage && userData.profileImage.startsWith('http') ? (
            <Image style={styles.profileImage} src={userData.profileImage} />
          ) : null}
        </View>

        {/* ── PROFESSIONAL SUMMARY ── */}
        {userData?.summary ? (
          <View style={styles.section} wrap={false}>
            <Text style={s('sectionTitle')}>{ui.professionalSummary || 'Professional Summary'}</Text>
            <Text style={s('summaryText')}>{userData.summary}</Text>
          </View>
        ) : null}

        {/* ── WORK EXPERIENCE ── */}
        {Array.isArray(userData?.experiences) && userData.experiences.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={s('sectionTitle')}>{ui.workExperience || 'Work Experience'}</Text>
            {userData.experiences.map((exp, idx) => {
              const startStr = formatDateDisplay(exp.startDate);
              const endStr = exp.current ? (ui.present || 'Present') : formatDateDisplay(exp.endDate);
              const dateRange = startStr ? `${startStr} — ${endStr || ui.present || 'Present'}` : '';

              return (
                <View key={idx} style={styles.entry}>
                  <View style={s('entryHeader')}>
                    <Text style={s('entryTitle')}>
                      {exp.position}{exp.company ? ` · ${exp.company}` : ''}
                    </Text>
                    {dateRange ? (
                      <Text style={styles.entryDate}>{dateRange}</Text>
                    ) : null}
                  </View>
                  {exp.location ? (
                    <Text style={s('entrySubtitle')}>{exp.location}</Text>
                  ) : null}
                  {exp.description ? (
                    <Text style={s('entryDesc')}>{exp.description}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {/* ── EDUCATION ── */}
        {Array.isArray(userData?.educations) && userData.educations.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={s('sectionTitle')}>{ui.education || 'Education'}</Text>
            {userData.educations.map((edu, idx) => {
              const startStr = formatDateDisplay(edu.startDate, true);
              const endStr = edu.current ? (ui.present || 'Present') : formatDateDisplay(edu.endDate, true);
              const dateRange = startStr ? `${startStr} — ${endStr || ui.present || 'Present'}` : '';

              return (
                <View key={idx} style={styles.entry}>
                  <View style={s('entryHeader')}>
                    <Text style={s('entryTitle')}>
                      {edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}
                    </Text>
                    {dateRange ? (
                      <Text style={styles.entryDate}>{dateRange}</Text>
                    ) : null}
                  </View>
                  {edu.institution ? (
                    <Text style={s('entrySubtitle')}>
                      {edu.institution}{edu.location ? ` (${edu.location})` : ''}
                    </Text>
                  ) : null}
                  {edu.description ? (
                    <Text style={s('entryDesc')}>{edu.description}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {/* ── SKILLS ── */}
        {skills.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={s('sectionTitle')}>{ui.skills || ui.technicalSkills || 'Skills'}</Text>
            <View style={s('tagRow')}>
              {skills.map((skill, idx) => (
                <Text key={idx} style={s('tag')}>{skill}</Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* ── LANGUAGES ── */}
        {languages.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={s('sectionTitle')}>{ui.languages || 'Languages'}</Text>
            <View style={s('langRow')}>
              <Text style={s('langText')}>{languages.join('   ·   ')}</Text>
            </View>
          </View>
        ) : null}

      </Page>
    </Document>
  );
}
