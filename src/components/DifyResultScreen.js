import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Paper, Typography, Backdrop, CircularProgress } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PaidIcon from '@mui/icons-material/Paid';

const DifyResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location全体:', location);
  console.log('location.state:', location.state);

  const { difyResponse: initialDifyResponse, mbtiType, zodiacSign, birthday } = location.state || {};
  console.log('取得した値:', { initialDifyResponse, mbtiType, zodiacSign, birthday });

  // デフォルトのデータ構造
  const defaultData = {
    恋愛: { 特性: '', 天命: '', アドバイス: '' },
    仕事: { 特性: '', 天命: '', アドバイス: '' },
    健康: { 特性: '', 天命: '', アドバイス: '' },
    お金: { 特性: '', 天命: '', アドバイス: '' },
    相性のいい人: { 友達: '', 恋人: '', 仕事: '' }
  };

  // 星座に対応する画像のマッピング
  const zodiacImages = {
    'おひつじ座': '/zodiac_characters/aries.png',
    'おうし座': '/zodiac_characters/taurus.png',
    'ふたご座': '/zodiac_characters/gemini.png',
    'かに座': '/zodiac_characters/cancer.png',
    'しし座': '/zodiac_characters/leo.png',
    'おとめ座': '/zodiac_characters/virgo.png',
    'てんびん座': '/zodiac_characters/libra.png',
    'さそり座': '/zodiac_characters/scorpio.png',
    'いて座': '/zodiac_characters/sagittarius.png',
    'やぎ座': '/zodiac_characters/capricorn.png',
    'みずがめ座': '/zodiac_characters/aquarius.png',
    'うお座': '/zodiac_characters/pisces.png'
  };

  const [formattedData, setFormattedData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [difyResponse, setDifyResponse] = useState(initialDifyResponse);

  useEffect(() => {
    if (!difyResponse) {
      console.error('Difyレスポンスがありません');
      return;
    }

    try {
      console.log('Difyレスポンス:', difyResponse);
      const jsonMatch = difyResponse.answer.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

      if (!jsonMatch) {
        console.error('JSONブロックが見つかりません');
        return;
      }

      const jsonStr = jsonMatch[1].trim();
      console.log('抽出されたJSON文字列:', jsonStr);

      const parsedData = JSON.parse(jsonStr);
      console.log('パース済みデータ:', parsedData);

      setFormattedData(parsedData);
    } catch (error) {
      console.error('JSONパースエラー:', error);
      setFormattedData(null);
    }
  }, [difyResponse]);

  const handleBack = () => {
    navigate(-1);
  };

  const generateDescription = async () => {
    setIsLoading(true);
    try {
      console.log('リクエストデータ:', { mbtiType, zodiacSign, birthday });
      const response = await fetch('https://api.dify.ai/v1/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.REACT_APP_DIFY_API_KEY
        },
        body: JSON.stringify({
          query: `以下の条件で取説を作成してください：
MBTI: ${mbtiType}
星座: ${zodiacSign}
生年月日: ${birthday}

以下のJSON形式で出力してください：
{
  "恋愛": {
    "特性": "",
    "天命": "",
    "アドバイス": ""
  },
  "仕事": {
    "特性": "",
    "天命": "",
    "アドバイス": ""
  },
  "健康": {
    "特性": "",
    "天命": "",
    "アドバイス": ""
  },
  "お金": {
    "特性": "",
    "天命": "",
    "アドバイス": ""
  },
  "相性のいい人": {
    "友達": "",
    "恋人": "",
    "仕事": ""
  }
}`,
          response_mode: "blocking",
          conversation_id: "",
          user: "user"
        })
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }

      const data = await response.json();
      console.log('APIレスポンス:', data);
      setDifyResponse(data);
    } catch (error) {
      console.error('APIリクエストエラー:', error);
      alert(`エラーが発生しました: ${error.message}\n\n再度お試しください。`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formattedData) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <p className="text-center">情報の取得中にエラーが発生しました。</p>
                  <p className="text-center">もう一度試してください。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ローディング表示 */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h5" color="inherit" sx={{ fontWeight: 'bold' }}>
          取説作成中や！
        </Typography>
      </Backdrop>

      <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#fafafa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #e0e0e0', pb: 2 }}>
          <Box
            component="img"
            src={zodiacImages[zodiacSign] || '/toramaro_worried.png'}
            alt={`${zodiacSign}のトラまろ`}
            sx={{
              width: 80,
              height: 80,
              mr: 2,
              objectFit: 'contain'
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {mbtiType}型 × {zodiacSign}の人の取説
          </Typography>
        </Box>

        {!difyResponse ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Button
              variant="contained"
              onClick={generateDescription}
              sx={{
                fontSize: '1.2rem',
                py: 2,
                px: 6,
                borderRadius: 2,
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#388e3c'
                }
              }}
            >
              作成開始
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* 恋愛 */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #ffcdd2',
                  backgroundColor: '#fff5f5'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #ffcdd2', pb: 2 }}>
                  <FavoriteIcon sx={{ fontSize: 32, color: '#e53935', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>恋愛</Typography>
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・特性
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.恋愛?.特性 || '情報がありません'}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・天命
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.恋愛?.天命 || '情報がありません'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・アドバイス
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.恋愛?.アドバイス || '情報がありません'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* 仕事 */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #bbdefb',
                  backgroundColor: '#f3f8ff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #bbdefb', pb: 2 }}>
                  <WorkIcon sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>仕事</Typography>
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・特性
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.仕事?.特性 || '情報がありません'}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・天命
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.仕事?.天命 || '情報がありません'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・アドバイス
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.仕事?.アドバイス || '情報がありません'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* 健康 */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #c8e6c9',
                  backgroundColor: '#f5fff5'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #c8e6c9', pb: 2 }}>
                  <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#43a047', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#43a047' }}>健康</Typography>
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・特性
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.健康?.特性 || '情報がありません'}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・天命
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.健康?.天命 || '情報がありません'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・アドバイス
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.健康?.アドバイス || '情報がありません'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* お金 */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #ffe0b2',
                  backgroundColor: '#fffaf0'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #ffe0b2', pb: 2 }}>
                  <PaidIcon sx={{ fontSize: 32, color: '#f57c00', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f57c00' }}>お金</Typography>
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・特性
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.お金?.特性 || '情報がありません'}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・天命
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.お金?.天命 || '情報がありません'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・アドバイス
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.お金?.アドバイス || '情報がありません'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* 相性のいい人 */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #e1bee7',
                  backgroundColor: '#faf5ff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderBottom: '2px solid #e1bee7', pb: 2 }}>
                  <PetsIcon sx={{ fontSize: 32, color: '#8e24aa', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8e24aa' }}>相性のいい人</Typography>
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・友達
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.相性のいい人?.友達 || '情報がありません'}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・恋人
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.相性のいい人?.恋人 || '情報がありません'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      ・仕事
                    </Typography>
                    <Typography variant="body1" sx={{ pl: 3, lineHeight: 1.8 }}>{formattedData?.相性のいい人?.仕事 || '情報がありません'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              fontSize: '1.1rem',
              py: 1.5,
              px: 4,
              borderRadius: 2
            }}
          >
            もう一度診断する
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DifyResultScreen;