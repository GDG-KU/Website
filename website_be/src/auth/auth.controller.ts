import { Controller, Get, UseGuards, Req, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './security/google.guard';
import { JwtAuthGuard } from './security/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokensResponseDto } from './dto/response/tokens.response.dto';
import { RefreshDto } from './dto/request/refresh.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({ summary: '구글 OAuth 인증', description: '프론트에서 이 api로 접근해야 함.' })
  @UseGuards(GoogleAuthGuard)
  // redirect to google login page
  async googleAuth(){}

  @Get('google/callback')
  @ApiOperation({ summary: '구글 OAuth 인증 콜백', description: '구글 로그인 후 이 api로 리다이렉트 됨.' })
  @ApiResponse({ 
    description: '구글 로그인 성공',
    type: TokensResponseDto,
  })
  @UseGuards(GoogleAuthGuard)
  // get user info from google
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response){
    // access token, refresh token 반환
    const {access_token, refresh_token} = await this.authService.googleCallback(req);
    // access_token, refresh token 쿠키에 저장
    res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 3600000, domain: '.koreauniv.gdgoc.kr'}); //1시간만 유효
    res.cookie('refresh_token', refresh_token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 604800000, domain: '.koreauniv.gdgoc.kr'}); //7일 유효

    return res.redirect('https://koreauniv.gdgoc.kr/');
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: 'access token, refresh token 삭제' })
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response){
    // access token, refresh token 쿠키 삭제
    res.clearCookie('access_token', { domain: '.koreauniv.gdgoc.kr'});
    res.clearCookie('refresh_token', { domain: '.koreauniv.gdgoc.kr'});
    return {message: 'logout success'};
  }


  @Post('refresh')
  @ApiOperation({ summary: 'JWT 토큰 재발급', description: 'access token이 만료되면 이 api로 재발급 받아야 함.' })
  @ApiResponse({ 
    description: 'JWT 토큰 재발급 성공',
    type: TokensResponseDto,
  })
  // refresh token
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response){
    // refresh token 검증 후 access token, refresh token 재발급
    console.log(req.cookies);
    const {access_token, refresh_token}= await this.authService.refreshTokens(req.cookies['refresh_token'])
    
    // access token, refresh token 쿠키에 저장
    res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 3600000, domain: '.koreauniv.gdgoc.kr'}); //1시간만 유효
    res.cookie('refresh_token', refresh_token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 604800000, domain: '.koreauniv.gdgoc.kr'}); //7일 유효
    
    return access_token;
  }

  @Get('api/test')
  @ApiOperation({ summary: '테스트 API', description: 'JWT 인증 테스트 api' })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  // test api
  getTest(@Req() req): string {
    const {user} = req;
    console.log(user.email);
    return 'success test';
  }
}
