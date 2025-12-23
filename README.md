# MERN Ecommerce App

A full-stack **MERN ecommerce application** where users can browse, search and purchase products, while admins can manage products, categories and orders.

---

## ✅ Features

* **User authentication** using JWT
* Browse products & search functionality
* Add products to cart and manage cart items
* **Admin dashboard** to manage products, categories and orders
* Responsive design for all devices
* **Dockerized app** with CI/CD workflow (build & push Docker image on push to `main`)

---

## ⚙️ Technologies

**Frontend:** React, Redux, Axios, React Router

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Authentication:** JWT

**Styling:** CSS / Bootstrap

**Deployment / CI-CD:** Docker, GitHub Actions

---

## 🐳 Docker CI/CD

* The app is **dockerized** with a workflow that automatically builds the Docker image and pushes it to **Docker Hub** whenever code is pushed to the `main` branch.
* GitHub Actions workflow file: `.github/workflows/docker-build.yml`
* Uses **GitHub secrets** to safely handle Docker Hub credentials.

---


