import Promise from 'bluebird'

export default {
  agent: (speech) => {
    return new Promise((res) => res(speech))
  },
  appraisal: (speech) => {
    return new Promise((res) => res(speech))
  },
  confirmation: (speech) => {
    return new Promise((res) => res(speech))
  },
  dialog: (speech) => {
    return new Promise((res) => res(speech))
  },
  emotions: (speech) => {
    return new Promise((res) => res(speech))
  },
  greetings: (speech) => {
    return new Promise((res) => res(speech))
  },
  person: (speech) => {
    return new Promise((res) => res(speech))
  },
  topics: (speech) => {
    return new Promise((res) => res(speech))
  },
  unknown: (speech) => {
    return new Promise((res) => res(speech))
  },
  user: (speech) => {
    return new Promise((res) => res(speech))
  },
}
