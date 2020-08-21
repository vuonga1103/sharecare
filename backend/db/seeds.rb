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
  precautions: "Dislikes loud noises and scratchy tags",
  bio: "Jack has ADHD and is on the autism spectrum. He loves hugs and his Blankie"
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
  role: "paraprofessional",
  level: "secondary"
})

post1 = Post.create({
  title: "Jack did great in therapy today!",
  content: "Hey all! Wanted to let you all know Jack did a FANTASTIC JOB in therapy today. We have been working on tying his shoes and today he did it ALL BY HIMSELF! Please encourage him to continue doing it! :)",
  priority: "low",
  author: anh
})

post2 = Post.create({
  title: "Jack's medication change",
  content: "Hi all, wanted you to know that we went to the doctor today and there is a change in Jack's medications. I will pack them in his lunchbox. Donat, please have him take it at noon. Please acknowledge this post so I know you have seen it. Thanks!",
  priority: "high",
  author: jenny
})

comment1 = Comment.create({
  content: "OMG this is WONDERFUL! Thank you so much for the update",
  commenter: jenny,
  post: post1
})

comment2 = Comment.create({
  content: "Nice! Looks like somebody doesn't need me to tie his shoes anymore!",
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