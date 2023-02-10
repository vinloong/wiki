import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Analytics } from '@vercel/analytics/react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function Technologies(){
return (
  <div className="container">
	  <img src='https://img.shields.io/badge/Kubernetes-lightgrey?logo=kubernetes' />&nbsp;
    <img src='https://img.shields.io/badge/Containerd-lightgrey?logo=Containerd' />&nbsp;
    <img src='https://img.shields.io/badge/Ingress-lightgrey?logo=Ingress' />&nbsp;
    <img src='https://img.shields.io/badge/Harbor-lightgrey?logo=Harbor' />&nbsp;
    <img src='https://img.shields.io/badge/Prometheus-lightgrey?logo=prometheus' />&nbsp;
    <br />
    <img src='https://img.shields.io/badge/Ceph-lightgrey?logo=ceph' />&nbsp;
    <img src='https://img.shields.io/badge/Docker-lightgrey?logo=docker' />&nbsp;
    <img src='https://img.shields.io/badge/Linux-lightgrey?logo=linux' />&nbsp;    
    <img src='https://img.shields.io/badge/Redis-lightgrey?logo=redis' />&nbsp;
    <img src='https://img.shields.io/badge/Elasticsearch-lightgrey?logo=elasticsearch' />&nbsp;    
    <img src='https://img.shields.io/badge/Git-lightgrey?logo=git' />&nbsp;
    <br />
    <img src='https://img.shields.io/badge/Postgresql-lightgrey?logo=postgresql' />&nbsp;
    <img src='https://img.shields.io/badge/Nginx-lightgrey?logo=nginx' />&nbsp;       
    <img src='https://img.shields.io/badge/Jenkins-lightgrey?logo=jenkins' />&nbsp;
    <img src='https://img.shields.io/badge/Zookeeper-lightgrey?logo=zookeeper' />&nbsp;
    <img src='https://img.shields.io/badge/Mqtt-lightgrey?logo=eclipse%20mosquitto' />&nbsp;
    <img src='https://img.shields.io/badge/Hdfs-lightgrey?logo=hdfs' />&nbsp;
    <br />
    <img src='https://img.shields.io/badge/Apache%20Kafka-lightgrey?logo=apache%20kafka' />&nbsp;
    <img src='https://img.shields.io/badge/Python-lightgrey?logo=python' />&nbsp;
    <img src='https://img.shields.io/badge/Scala-lightgrey?logo=scala' />&nbsp;
    <img src='https://img.shields.io/badge/Java-lightgrey?logo=java' />&nbsp;
    <img src='https://img.shields.io/badge/CSharp-lightgrey?logo=Csharp' />&nbsp;
    <img src='https://img.shields.io/badge/Go-lightgrey?logo=go' />
  </div>
)

}


function HomeBackground() {
  return (
    <div className={styles.myHeroContainer}>
      <div className={styles.leftContainer}>
        <h2 className={styles.leftContainer_h}>
          Always <br /> For Freedom.
        </h2>
        <p className={styles.leftContainer_p}>
          面朝大海，春暖花开 🌊
          <br />
          &emsp;&emsp;闲看庭前花开花落 🌹
          <br />
          &emsp;&emsp;&emsp;&emsp;漫随天外云卷云舒 ☁️
        </p>
        <Technologies />
        <div className={styles.buttonContainer}>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/category/docs">
              Start Loong's Wiki ...
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>
        {/* <img src={Background} alt='Background' /> */}
        <img src='https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/01/23/8b0a1b.jpg' alt='Background' />
      </div>
    </div>
  )
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      {/* <HomepageHeader /> */}
      <main>
        <HomeBackground />
        <Analytics />
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
