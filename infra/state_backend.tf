terraform {
  backend "s3" {
    bucket         = "terraform-state-20241009"
    key            = "node-security.tfstate"
    region         = "us-east-1"
  }
}