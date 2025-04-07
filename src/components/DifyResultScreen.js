import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
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

  const { difyResponse, mbtiType, zodiacSign, birthday } = location.state || {};
  console.log('取得した値:', { difyResponse, mbtiType, zodiacSign, birthday });

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

  const [formattedData, setFormattedData] = useState({
    恋愛: { 特性: '', 天命: '', アドバイス: '' },
    仕事: { 特性: '', 天命: '', アドバイス: '' },
    健康: { 特性: '', 天命: '', アドバイス: '' },
    お金: { 特性: '', 天命: '', アドバイス: '' },
    相性のいい人: { 友達: '', 恋人: '', 仕事: '' }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mbtiType || !zodiacSign || !birthday) {
      console.error('必要なデータが不足しています:', { mbtiType, zodiacSign, birthday });
      navigate('/mbti-test');
      return;
    }

    if (!difyResponse) {
      generateDescription();
    } else if (difyResponse.data && difyResponse.data.outputs && difyResponse.data.outputs.text) {
      const text = difyResponse.data.outputs.text;
      console.log('Difyレスポンステキスト:', text);

      try {
        // テキストを直接JSONとしてパース
        const parsedData = JSON.parse(text);
        console.log('パースされたJSONデータ:', parsedData);

        if (parsedData && typeof parsedData === 'object') {
          const formattedResult = {
            恋愛: { 特性: '', 天命: '', アドバイス: '' },
            仕事: { 特性: '', 天命: '', アドバイス: '' },
            健康: { 特性: '', 天命: '', アドバイス: '' },
            お金: { 特性: '', 天命: '', アドバイス: '' },
            相性のいい人: { 友達: '', 恋人: '', 仕事: '' }
          };

          // 各カテゴリのデータを設定
          ['恋愛', '仕事', '健康', 'お金'].forEach(category => {
            if (parsedData[category]) {
              formattedResult[category] = {
                特性: parsedData[category].特性 || '',
                天命: parsedData[category].天命 || '',
                アドバイス: parsedData[category].アドバイス || ''
              };
            }
          });

          // 相性のいい人のデータを設定
          if (parsedData['相性のいい人']) {
            formattedResult['相性のいい人'] = {
              友達: parsedData['相性のいい人'].友達 || '',
              恋人: parsedData['相性のいい人'].恋人 || '',
              仕事: parsedData['相性のいい人'].仕事 || ''
            };
          }

          console.log('整形後のデータ:', formattedResult);
          setFormattedData(formattedResult);
          return;
        }
      } catch (error) {
        console.error('JSONパースエラー:', error);
        console.error('パース失敗したJSON文字列:', text);

        // JSONブロックを探して再試行
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const jsonContent = jsonMatch[1].trim()
              .replace(/[\u200B-\u200D\uFEFF]/g, '')
              .replace(/\n\s*\n/g, '\n')
              .replace(/^\s+|\s+$/gm, '');

            const parsedData = JSON.parse(jsonContent);
            if (parsedData && typeof parsedData === 'object') {
              setFormattedData(parsedData);
              return;
            }
          } catch (innerError) {
            console.error('JSONブロックのパースにも失敗:', innerError);
          }
        }
      }

      // パースに失敗した場合のデフォルト値
      const defaultData = {
        恋愛: { 特性: '', 天命: '', アドバイス: '' },
        仕事: { 特性: '', 天命: '', アドバイス: '' },
        健康: { 特性: '', 天命: '', アドバイス: '' },
        お金: { 特性: '', 天命: '', アドバイス: '' },
        相性のいい人: { 友達: '', 恋人: '', 仕事: '' }
      };

      setFormattedData(defaultData);
    }
  }, [difyResponse]);

  const handleBack = () => {
    navigate(-1);
  };

  const generateDescription = async () => {
    setIsLoading(true);
    try {
      console.log('リクエストデータ:', { mbtiType, zodiacSign, birthday });
      const requestBody = {
        workflow_id: process.env.REACT_APP_DIFY_WORKFLOW_ID,
        user: 'default',
        inputs: {
          mbti: mbtiType || '',
          zodiac: zodiacSign || '',
          birthday: birthday || '2000-01-01',
          gender: location.state?.gender || 'not_specified'
        }
      };
      console.log('送信するリクエストボディ:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_DIFY_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('APIレスポンス:', errorText);
        throw new Error(`APIエラー (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('APIレスポンスデータ:', data);

      if (data && data.answer) {
        try {
          // JSONブロックを探す
          const jsonMatch = data.answer.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            const jsonContent = jsonMatch[1].trim()
              .replace(/[\u200B-\u200D\uFEFF]/g, '') // 不可視文字を削除
              .replace(/\n\s*\n/g, '\n') // 空行を削除
              .replace(/^\s+|\s+$/gm, ''); // 各行の先頭と末尾の空白を削除

            console.log('クリーニング後のJSON文字列:', jsonContent);
            const parsedData = JSON.parse(jsonContent);
            console.log('パースされたJSONデータ:', parsedData);

            // データ構造を確認
            if (parsedData && typeof parsedData === 'object') {
              const formattedResult = {
                恋愛: { 特性: '', 天命: '', アドバイス: '' },
                仕事: { 特性: '', 天命: '', アドバイス: '' },
                健康: { 特性: '', 天命: '', アドバイス: '' },
                お金: { 特性: '', 天命: '', アドバイス: '' },
                相性のいい人: { 友達: '', 恋人: '', 仕事: '' }
              };

              // 各カテゴリのデータを設定
              ['恋愛', '仕事', '健康', 'お金'].forEach(category => {
                if (parsedData[category]) {
                  formattedResult[category] = {
                    特性: parsedData[category].特性 || '',
                    天命: parsedData[category].天命 || '',
                    アドバイス: parsedData[category].アドバイス || ''
                  };
                }
              });

              // 相性のいい人のデータを設定
              if (parsedData['相性のいい人']) {
                formattedResult['相性のいい人'] = {
                  友達: parsedData['相性のいい人'].友達 || '',
                  恋人: parsedData['相性のいい人'].恋人 || '',
                  仕事: parsedData['相性のいい人'].仕事 || ''
                };
              }

              console.log('整形後のデータ:', formattedResult);
              setFormattedData(formattedResult);
              return;
            }
          }
          throw new Error('Invalid JSON format');
        } catch (error) {
          console.error('JSON解析エラー:', error);
          console.error('解析失敗したデータ:', data.answer);
          alert(`エラーが発生しました: ${error.message}\n\n再度お試しください。`);
        }
      }
    } catch (error) {
      console.error('APIリクエストエラー:', error);
      alert(`エラーが発生しました: ${error.message}\n\n再度お試しください。`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!difyResponse || !formattedData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          データの読み込みに失敗しました。
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            戻る
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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