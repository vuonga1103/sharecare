# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Acknowledgment.destroy_all
CareReceiver.destroy_all
Caregiver.destroy_all
Comment.destroy_all
Post.destroy_all

jack = CareReceiver.create({
  name: "Jack",
  age: 7,
  allergies: "Peanuts, bees",
  precautions: "Dislikes loud noises",
  bio: "Jack has ADHD and is on the autism spectrum disorder"
})


anh = Caregiver.create({
  name: "Anh",
  username: "anh",
  email: "anh@anh.com",
  care_receiver: jack,
  role: "occupational therapist",
  level: "secondary"
})

jenny = Caregiver.create({
  name: "Jenny",
  username: "jenny",
  email: "jenny@jenny.com",
  care_receiver: jack,
  role: "mom",
  level: "primary"
})

donat = Caregiver.create({
  name: "Donat",
  username: "donat",
  email: "donat@donat.com",
  care_receiver: jack,
  role: "teacher",
  level: "secondary"
})

post1 = Post.create({
  title: "update on jack's therapy session",
  content: "hi jenny, jack had an outburst today and injured his arm in the playground, he was seen by the nurse and everything is ok",
  priority: "high",
  author: anh
})

post2 = Post.create({
  title: "jack's homework for today",
  content: "hi jenny, please have jack do his math homework from pages 8-9 tonight. thanks!",
  priority: "low",
  author: donat
})

comment1 = Comment.create({
  content: "ok, thank you so much for letting me know",
  commenter: jenny,
  post: post1
})

comment2 = Comment.create({
  content: "noted, i'll talk to him about how to manage his anger in class",
  commenter: donat,
  post: post1
})

acknowledgment1 = Acknowledgment.create({
  caregiver: donat,
  post: post1
})

acknowledgment2 = Acknowledgment.create({
  caregiver: jenny,
  post: post1
})