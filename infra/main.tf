resource "aws_instance" "ec2_instance" {
  ami                         = data.aws_ami.ubuntu_ami.id
  instance_type               = "t2.micro"
  subnet_id                   = data.aws_subnet.default_subnet.id
  associate_public_ip_address = true
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.security_groups.id]
  user_data = templatefile("./scripts/user_data.sh.tpl", {
    port  = var.backend_port,
    image = var.docker_image,
    tag   = var.image_tag,
  })

  tags = {
    Project = "node-security"
  }
}

resource "aws_security_group" "security_groups" {
  name        = "Node-security-sg"
  description = "Open backend ports"
  vpc_id      = data.aws_vpc.default_vpc.id

  tags = {
    Project = "node-security"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_backend_port" {
  security_group_id = aws_security_group.security_groups.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = var.backend_port
  ip_protocol       = "tcp"
  to_port           = 8140
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
  security_group_id = aws_security_group.security_groups.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}

resource "aws_vpc_security_group_egress_rule" "allow_backend_port" {
  security_group_id = aws_security_group.security_groups.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = var.backend_port
  ip_protocol       = "tcp"
  to_port           = 8140
}

resource "aws_vpc_security_group_egress_rule" "allow_ssh" {
  security_group_id = aws_security_group.security_groups.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}


resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_debug" {
  security_group_id = aws_security_group.security_groups.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

