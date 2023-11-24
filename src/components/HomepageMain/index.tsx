import { Variants, motion } from 'framer-motion' // Import motion from framer-motion
import HomeMain from '@site/static/img/undraw_main.svg'
import styles from './styles.module.scss'
import { Icon, IconProps } from '@iconify/react'
import SocialLinks from '@site/src/components/SocialLinks'
import Link from '@docusaurus/Link';

const variants: Variants = {
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0, y: 30 },
}

function Logos() {
  const logos: IconProps[] = [
    // cncf
    {
      icon: 'logos:kubernetes',
      style: { top: '18%', right: '40%' },
    },
    {
      icon: 'simple-icons:containerd',
      style: { top: '18%', right: '30%', color: 'rgb(8, 8, 8)' },
    },
    {
      icon: 'skill-icons:docker',
      style: { top: '18%', right: '20%' },
    },
    {
      icon: 'skill-icons:prometheus',
      style: { top: '18%', right: '10%' },
    },
    {
      icon: 'simple-icons:ingress',
      style: { top: '28%', right: '40%', color: 'rgb(30,144,255)' },
    },
    {
      icon: 'simple-icons:harbor',
      style: { top: '28%', right: '30%', color: 'rgb(95, 185, 50)' },
    },
    {
      icon: 'simple-icons:ceph',
      style: { top: '28%', right: '20%', color: 'rgb(240,128,128)' },
    },
    {
      icon: 'simple-icons:kaniko',
      style: { top: '28%', right: '10%', color: 'rgb(255, 166, 0)' },
    },
    {
      icon: 'logos:buildkite-icon',
      style: { top: '38%', right: '30%' },
    },
    {
      icon: 'skill-icons:jenkins-light',
      style: { top: '38%', right: '20%' },
    },
    {
      icon: 'devicon:argocd',
      style: { top: '38%', right: '10%' },
    },
    {
      icon: 'logos:drone-icon',
      style: { top: '48%', right: '30%' },
    },
    {
      icon: 'simple-icons:gitea',
      style: { top: '48%', right: '20%', color: 'rgb(96, 153, 38)' },
    },
    {
      icon: 'skill-icons:git',
      style: { top: '48%', right: '10%' },
    },
    {
      icon: 'skill-icons:linux-light',
      style: { top: '58%', right: '10%' },
    },

    // ==============================================
    {
      icon: 'simple-icons:mqtt',
      style: { top: '5%', left: '13%', color: 'rgb(128,0,128)' },
    },
    {
      icon: 'logos:elasticsearch',
      style: { top: '5%', left: '21%' },
    },
    {
      icon: 'skill-icons:nginx',
      style: { top: '5%', left: '29%' },
    },
    {
      icon: 'skill-icons:kafka',
      style: { top: '5%', left: '37%' },
    },
    {
      icon: 'skill-icons:postgresql-light',
      style: { top: '5%', left: '45%' },
    },
    {
      icon: 'skill-icons:redis-light',
      style: { top: '5%', left: '53%' },
    },
    {
      icon: 'skill-icons:github-light',
      style: { top: '5%', left: '61%' },
    },
    {
      icon: 'skill-icons:postman',
      style: { top: '5%', left: '69%' },
    },

    // ==============================================
    {
      icon: 'skill-icons:bash-light',
      style: { top: '20%', left: '10%' },
    },
    {
      icon: 'logos:vim',
      style: { top: '20%', left: '20%' },
    },
    {
      icon: 'pajamas:pipeline',
      style: { top: '20%', left: '30%', color: 'rgb(70, 107, 176)' },
    },
    {
      icon: 'logos:yaml',
      style: { top: '20%', left: '40%' },
    },

    // 语言
    {
      icon: 'skill-icons:golang',
      style: { top: '20%', left: '0%' },
    },
    {
      icon: 'skill-icons:python-light',
      style: { top: '30%', left: '0%' },
    },
    {
      icon: 'skill-icons:scala-light',
      style: { top: '40%', left: '0%' },
    },
    {
      icon: 'logos:c-sharp',
      style: { top: '50%', left: '0%' },
    },
    {
      icon: 'devicon:dotnetcore',
      style: { top: '60%', left: '0%' },
    },

  ]

  return (
    <div>
      {logos.map((l) => {

        return (
          <motion.div
            className={styles.box}
            initial={{ opacity: 0.01, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: Math.random() * 2 + 0.5,
              delay: 0.5,
            }}
            style={{
              ...l.style
            }}
          >
            <Icon icon={l.icon}></Icon>
          </motion.div>
        )
      })}
    </div>
  )
}

function Background() {
  return (
    <div>
      <motion.div className={styles.background}>
        <Logos />
        <HomeMain />
        <div className={styles.circle} />
      </motion.div>
    </div>
  )
}

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseMove={e => {
        e.currentTarget.style.setProperty('--x', `${e.clientX}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY}px`)
      }}
    >
      Hi! I'm
      <span
        className={styles.name}
        onMouseMove={e => {
          const bounding = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--positionX', `${bounding.x}px`)
          e.currentTarget.style.setProperty('--positionY', `${bounding.y}px`)
        }}
      > loong
      </span>
      <span className={styles.wave}></span>
    </motion.div>
  )
}

function Description() {
  return (
    <motion.p
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <p className={styles.leftContainer_p}>
        面朝大海，春暖花开 🌊
        <br />
        &emsp;&emsp;闲看庭前花开花落 🌹
        <br />
        &emsp;&emsp;&emsp;&emsp;漫随天外云卷云舒 ☁️
      </p>
    </motion.p>
  )
}

function TagLinks() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <SocialLinks />
    </motion.div>
  )
}

function ButtonStart() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className={styles.buttonContainer}>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="k8s">
            Start Loong's Wiki ...
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <motion.div className={styles.hero}>
      <div className={styles.intro}>
        <Name />

        <Description />

        <TagLinks />

        <ButtonStart />

      </div>
      <Background />
    </motion.div>
  )
}
