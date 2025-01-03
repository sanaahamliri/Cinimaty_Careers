import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/src/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const existingUser = await db.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}