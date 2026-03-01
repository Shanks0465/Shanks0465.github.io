import { db } from './firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

export async function fetchProfile() {
  const snap = await getDoc(doc(db, 'profile', 'data'))
  return snap.exists() ? snap.data() : null
}

export async function fetchEducation() {
  const snap = await getDocs(collection(db, 'education'))
  let meta = {}
  const education = []
  snap.forEach((d) => {
    if (d.id === '_meta') meta = d.data()
    else education.push(d.data())
  })
  return { ...meta, education }
}

export async function fetchExperience() {
  const snap = await getDocs(collection(db, 'experience'))
  let meta = {}
  const experiences = []
  const awards = []
  snap.forEach((d) => {
    if (d.id === '_meta') {
      meta = d.data()
    } else if (d.data()._type === 'award') {
      const { _type, ...award } = d.data()
      awards.push(award)
    } else {
      experiences.push(d.data())
    }
  })
  return { ...meta, experiences, awards }
}

export async function fetchPapers() {
  const snap = await getDocs(collection(db, 'papers'))
  let meta = {}
  const papers = []
  snap.forEach((d) => {
    if (d.id === '_meta') meta = d.data()
    else papers.push(d.data())
  })
  return { ...meta, papers }
}

export async function fetchProjects() {
  const snap = await getDocs(collection(db, 'projects'))
  let meta = {}
  const projects = []
  snap.forEach((d) => {
    if (d.id === '_meta') meta = d.data()
    else projects.push(d.data())
  })
  return { ...meta, projects }
}

export async function fetchSkills() {
  const snap = await getDocs(collection(db, 'skills'))
  let meta = {}
  const categories = []
  snap.forEach((d) => {
    if (d.id === '_meta') meta = d.data()
    else categories.push(d.data())
  })
  return { ...meta, categories }
}

export async function fetchAllData() {
  const [profile, education, experience, papers, projects, skills] =
    await Promise.all([
      fetchProfile(),
      fetchEducation(),
      fetchExperience(),
      fetchPapers(),
      fetchProjects(),
      fetchSkills(),
    ])
  return { profile, education, experience, papers, projects, skills }
}
