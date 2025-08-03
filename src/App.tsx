import { useMemo, useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from 'motion/react'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import './index.css'

/**
 * Premium UI polish:
 * - Spotlight cursor + magnetic buttons
 * - 3D parallax hero with gradient noise field
 * - Glassmorphism cards with animated borders
 * - Scroll-driven reveals and hash-nav smoothing
 * - Accessible, dark-first, OKLCH aware
 */

/* ---------- utilities ---------- */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ---------- primitives ---------- */
function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

function Section(props: {
  id?: string
  eyebrow?: string
  title?: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}) {
  const { id, eyebrow, title, subtitle, children, className } = props
  return (
    <section id={id} className={cn('relative py-18 sm:py-24', className)}>
      <Container>
        {(eyebrow || title || subtitle) && (
          <header className="mb-10">
            {eyebrow && (
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                {eyebrow}
              </motion.div>
            )}
            {title && (
              <motion.h2
                initial={{ y: 14, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-3xl sm:text-4xl font-semibold tracking-tight"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
                className="mt-3 text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  )
}

function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: React.ReactNode
  tone?: 'default' | 'muted' | 'primary'
  className?: string
}) {
  const toneClass =
    tone === 'primary'
      ? 'bg-primary/90 text-primary-foreground'
      : tone === 'muted'
      ? 'bg-muted text-muted-foreground'
      : 'bg-secondary text-secondary-foreground'
  return (
    <span className={cn('inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium backdrop-blur', toneClass, className)}>
      {children}
    </span>
  )
}

/* ---------- interactive effects ---------- */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  const maskImage = useMotionTemplate`radial-gradient(180px 180px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.28), transparent 60%)`

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-10">
      <motion.div
        style={{ WebkitMaskImage: maskImage, maskImage }}
        className="absolute inset-0 bg-[oklch(0.97_0_0)] dark:bg-[oklch(0.2_0_0)]"
      />
    </div>
  )
}

function Magnetic({ children }: { children: (hover: boolean) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - rect.left - rect.width / 2
      const relY = e.clientY - rect.top - rect.height / 2
      x.set(relX * 0.15)
      y.set(relY * 0.15)
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ x, y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-block"
    >
      {children(hover)}
    </motion.div>
  )
}

/* ---------- chrome ---------- */
function Nav() {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0.4, 0.7])
  const borderOpacity = useTransform(scrollY, [0, 80], [0.0, 1])

  return (
    <motion.div
      style={{
        background: useMotionTemplate`oklch(var(--background) / ${bgOpacity})`,
        borderColor: useMotionTemplate`oklch(var(--border) / ${borderOpacity})`,
      }}
      className="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-semibold tracking-tight">Smit Dhameliya</a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#about">About</a>
          <a className="hover:text-foreground" href="#skills">Skills</a>
          <a className="hover:text-foreground" href="#experience">Experience</a>
          <a className="hover:text-foreground" href="#projects">Projects</a>
          <a className="hover:text-foreground" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Magnetic>
            {(hover) => (
              <Button size="sm" className={cn('rounded-md', hover && 'scale-[1.03] transition')}>
                Contact
              </Button>
            )}
          </Magnetic>
        </div>
      </Container>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.9_0_0/.08),transparent_40%),radial-gradient(circle_at_top_right,oklch(0.9_0_0/.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.9_0_0/.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.9_0_0/.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
    </motion.div>
  )
}

function GradientField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[60rem] w-[80rem] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_50%,oklch(0.74_0.1_270)_0deg,transparent_120deg,oklch(0.74_0.1_270)_240deg)] blur-3xl opacity-30" />
      <div className="absolute left-1/3 top-40 h-80 w-80 rounded-full bg-primary/15 blur-2xl" />
      <div className="absolute right-1/4 top-64 h-64 w-64 rounded-full bg-chart-2/25 blur-2xl" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-0 opacity-[0.06] [background:repeating-conic-gradient(from_0deg,oklch(0.85_0_0)_0deg_2deg,transparent_2deg_4deg)] mix-blend-overlay" />
    </div>
  )
}

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -60])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -3])
  const glow = useMotionTemplate`0 0 0 0 oklch(0.7 0.12 280 / 0.4)`

  return (
    <div id="top" ref={containerRef} className="relative overflow-hidden">
      <GradientField />
      <Spotlight />
      <Container>
        <motion.div style={{ y, rotate }} className="py-20 sm:py-28 will-change-transform">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge tone="primary" className="shadow-sm ring-1 ring-black/5">Full Stack</Badge>
            <Badge>IoT</Badge>
            <Badge>Cloud</Badge>
            <Badge>Networking</Badge>
          </div>
          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-balance text-4xl sm:text-6xl font-semibold tracking-tight"
          >
            Building systems that connect devices, data, and people.
          </motion.h1>
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
            className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground"
          >
            I design and ship robust apps and infrastructure across web, mobile, and edge—integrating MQTT-based IoT,
            AWS-backed platforms, and enterprise-grade networks.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              {(hover) => (
                <Button className={cn('rounded-md', hover && 'scale-[1.02] transition')} onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Projects <ArrowUpRight className="ml-1 size-4" />
                </Button>
              )}
            </Magnetic>
            <Magnetic>
              {(hover) => (
                <Button variant="secondary" className={cn('rounded-md', hover && 'scale-[1.02] transition')} onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get in touch
                </Button>
              )}
            </Magnetic>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ boxShadow: glow }}
            className="pointer-events-none mt-14 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </motion.div>
      </Container>
    </div>
  )
}

function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Smit Dhameliya"
      subtitle="Full Stack Developer • IoT • Cloud & Networking"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 prose prose-neutral max-w-none dark:prose-invert"
        >
          <p>
            Results-oriented Full Stack Developer specializing in MERN with strong command of React, Next.js, and Node.js.
            Hands-on experience integrating software with hardware via MQTT for real-time device communication. Proficient
            in AWS, CI/CD, and self-hosting on Proxmox with deep practical knowledge of systems and enterprise networking using pfSense.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-xl border bg-card/60 p-5 backdrop-blur"
        >
          <div className="text-sm font-semibold mb-3">Core Focus</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-primary" /><span>IoT + MQTT systems</span></li>
            <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-primary" /><span>Cloud (AWS) platforms</span></li>
            <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-primary" /><span>Self-hosting with Proxmox</span></li>
            <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-primary" /><span>Networking with pfSense</span></li>
          </ul>
        </motion.div>
      </div>
    </Section>
  )
}

function Skills() {
  const skillGroups = useMemo(
    () => [
      { name: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'SQL', 'Java'] },
      { name: 'Frontend', items: ['React.js', 'Next.js', 'HTML5', 'CSS3'] },
      { name: 'Backend', items: ['Node.js', 'Express.js'] },
      { name: 'Mobile', items: ['React Native', 'Flutter'] },
      { name: 'Databases', items: ['MySQL', 'PostgreSQL'] },
      { name: 'IoT', items: ['MQTT Protocol'] },
      { name: 'Cloud & DevOps', items: ['AWS (EC2, RDS, ECS, S3)', 'Cloudflare (CDN & Security)', 'CI/CD'] },
      { name: 'Virtualization & Self-Hosting', items: ['Proxmox VE'] },
      { name: 'Networking', items: ['pfSense, Captive Portal, DHCP, Routing', 'Custom Network Design'] },
    ],
    []
  )

  return (
    <Section id="skills" eyebrow="Skills" title="Technical Skills">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.name}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.03 }}
            className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-sm backdrop-blur"
          >
            <div className="mb-3 text-sm font-semibold">{group.name}</div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function Experience() {
  const bullets = [
    'Integrated MQTT for real-time device telemetry and control.',
    'Designed CI/CD pipelines for reliable deployment to AWS.',
    'Built scalable self-hosted environments on Proxmox.',
    'Engineered secure enterprise-grade networks via pfSense.',
  ]
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="IoT, Cloud, and Network Engineering"
      subtitle="Impact across the stack—devices to cloud to network."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-xl border bg-card/60 p-6 shadow-sm backdrop-blur"
        >
          <div className="mb-4 text-sm font-semibold">Core Themes</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.03 }}
          className="rounded-xl border bg-card/60 p-6 shadow-sm backdrop-blur"
        >
          <div className="mb-4 text-sm font-semibold">Stack Snapshot</div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary">React</Badge>
            <Badge>Next.js</Badge>
            <Badge>Node.js</Badge>
            <Badge>MQTT</Badge>
            <Badge>AWS</Badge>
            <Badge>CI/CD</Badge>
            <Badge>Proxmox</Badge>
            <Badge>pfSense</Badge>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

function Projects() {
  const projects = [
    {
      title: 'Custom Network Infrastructure',
      summary:
        'Designed and implemented a complete, custom network using pfSense with secure firewall, captive portal, and DHCP/router roles.',
      impact:
        'Elevated security posture, centralized control, and improved observability for corporate operations.',
      tags: ['pfSense', 'Routing', 'Firewall', 'DHCP', 'Security'],
    },
    {
      title: 'Home Lab & Self-Hosting',
      summary:
        'Built and maintain a Proxmox-based home server hosting databases, mail, and multiple websites.',
      impact:
        'Hands-on expertise in virtualization, automation, and infra lifecycle management from the ground up.',
      tags: ['Proxmox', 'Virtualization', 'Self-hosting', 'DevOps'],
    },
  ]

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected Work"
      subtitle="Representative initiatives demonstrating breadth and depth."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, idx) => (
          <motion.article
            key={p.title}
            initial={{ y: 18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.03 }}
            className="group relative overflow-hidden rounded-2xl border bg-card/60 p-0 shadow-sm transition hover:shadow-md backdrop-blur"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(120px_60px_at_20%_30%,oklch(0.8_0.12_270/.3),transparent_60%),radial-gradient(120px_60px_at_80%_70%,oklch(0.8_0.12_200/.25),transparent_60%),linear-gradient(180deg,oklch(1_0_0),oklch(0.98_0_0))] dark:bg-[radial-gradient(120px_60px_at_20%_30%,oklch(0.3_0.12_270/.35),transparent_60%),radial-gradient(120px_60px_at_80%_70%,oklch(0.35_0.12_200/.3),transparent_60%),linear-gradient(180deg,oklch(0.22_0_0),oklch(0.18_0_0))]" />
              <div className="absolute inset-0 opacity-10 [background:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
            <div className="p-6">
              <div className="mb-2 text-xs text-muted-foreground uppercase tracking-wide">Case Study</div>
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
              <p className="mt-3 text-sm">{p.impact}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </Section>
  )
}

function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s build something reliable"
      subtitle="Available for full-time roles, collaborations, and consulting."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Magnetic>
          {(hover) => (
            <Button className={cn('rounded-md', hover && 'scale-[1.02] transition')} asChild>
              <a href="mailto:smit.dhameliya@example.com"><Mail className="mr-2 size-4" />Email Me</a>
            </Button>
          )}
        </Magnetic>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Linkedin className="size-4" /> LinkedIn
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Github className="size-4" /> GitHub
        </a>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="border-t py-10">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Smit Dhameliya</div>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-foreground">Back to top</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

/* ---------- app ---------- */
export default function App() {
  useEffect(() => {
    // smooth hash navigation
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t && t.closest('a[href^="#"]')) {
        const link = t.closest('a[href^="#"]') as HTMLAnchorElement
        const id = link.getAttribute('href')!.slice(1)
        const el = document.getElementById(id)
        if (el) {
          e.preventDefault()
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          history.replaceState(null, '', `#${id}`)
        }
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return (
    <div className="min-h-dvh">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
