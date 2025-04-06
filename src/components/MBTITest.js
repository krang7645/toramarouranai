import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialScreen from './InitialScreen';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import DifyResultScreen from './DifyResultScreen';
import { calculateZodiacSign, getMBTIType, getTypeDescription } from '../utils/helpers';

const MBTITest = () => {
  // アプリケーションの状態
  const [step, setStep] = useState(1); // 1: 初期画面, 2: 診断画面, 3: 結果画面, 4: Dify結果画面
  const [birthdate, setBirthdate] = useState({
    year: new Date().getFullYear() - 20,
    month: 1,
    day: 1
  });
  const [gender, setGender] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  });
  const [mbtiType, setMbtiType] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [loading, setLoading] = useState(false);
  const [difyResponse, setDifyResponse] = useState(null);
  const navigate = useNavigate();

  // MBTI診断の質問
  const questions = [
    {
      text: "休日は家でゆっくり過ごすよりも、外出して友人と過ごす方が好きだ",
      dimension: "EI",
      direction: "E"
    },
    {
      text: "具体的な事実よりも、アイデアや可能性について考えるのが好きだ",
      dimension: "SN",
      direction: "N"
    },
    {
      text: "決断する際は、論理的に考えるよりも、人の気持ちを優先する",
      dimension: "TF",
      direction: "F"
    },
    {
      text: "計画を立てて行動するよりも、その場の流れに身を任せる方が好きだ",
      dimension: "JP",
      direction: "P"
    },
    {
      text: "初対面の人との会話は苦手だ",
      dimension: "EI",
      direction: "I"
    },
    {
      text: "詳細よりも全体像を重視する傾向がある",
      dimension: "SN",
      direction: "N"
    },
    {
      text: "グループでの意思決定では、公平性よりも全員の調和を重視する",
      dimension: "TF",
      direction: "F"
    },
    {
      text: "予定変更があると落ち着かない",
      dimension: "JP",
      direction: "J"
    },
    {
      text: "新しい環境ではすぐに馴染むほうだ",
      dimension: "EI",
      direction: "E"
    },
    {
      text: "問題解決には、従来の方法よりも新しいアプローチを試したい",
      dimension: "SN",
      direction: "N"
    }
  ];

  // 診断スタートボタンのハンドラ
  const handleStartDiagnosis = () => {
    if (!gender) {
      alert('性別を選択してください');
      return;
    }

    const calculatedZodiac = calculateZodiacSign(birthdate.month, birthdate.day);
    setZodiacSign(calculatedZodiac);
    setStep(2);
  };

  // 質問への回答ハンドラ
  const handleAnswer = (score) => {
    const question = questions[currentQuestion];
    const { dimension, direction } = question;

    const newScores = { ...scores };
    if (direction === dimension[0]) {
      newScores[dimension[0]] += score;
    } else {
      newScores[dimension[1]] += score;
    }

    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 診断完了
      const type = getMBTIType(newScores);
      setMbtiType(type);
      setStep(3);
    }
  };

  // Difyへのデータ送信とレスポンス取得
  const sendToDify = async () => {
    // 前回のレスポンスをクリアして準備状態に
    setDifyResponse(null);
    setLoading(true);

    // テスト用のダミーデータ（本番環境では削除）
    const testResponseData = {
      "恋愛": "山羊座の真面目さとENFPの天真爛漫さ、ギャップ萌えやで！ただ、真面目すぎると相手が疲れちゃうかも。たまにはノリでデートに誘ってみ！あと、感情豊かやから、相手の気持ちもちゃんと汲み取ってあげてな。ええ恋、掴めるで！",
      "仕事": "クリエイティブな才能と計画性、最強やん！でも、飽きっぽいとこもあるから、目標をコロコロ変えんと、一つずつ確実にクリアしていこ！チームワークも大切に。ワイはあんたの熱意、信じてるで！",
      "健康": "エネルギッシュなのはええけど、無理は禁物！山羊座は元々体が丈夫やけど、ENFPはストレス溜めやすいから、定期的にリフレッシュせなアカンで！運動もええけど、ワイと一緒にお昼寝もええで！",
      "お金": "頭の回転が速いから、お金儲けのチャンスも多いはず！でも、衝動買いには要注意やで！計画的に貯金も忘れずに。投資もええけど、リスク管理はしっかりな！ワイはあんたが賢くお金を使えるように祈ってるで！"
    };

    // テスト用APIモックとして使用
    const USE_TEST_DATA = false;

    if (USE_TEST_DATA) {
      console.log('テストデータを使用します:', testResponseData);
      // 有効性をテスト
      const isValid = hasValidContent(testResponseData);
      console.log('テストデータは有効か:', isValid);

      if (isValid) {
        setDifyResponse(testResponseData);
        setLoading(false);
        setStep(4);
        return;
      } else {
        console.error('テストデータが無効です！問題が残っています');
      }
    }

    // セッション固有のIDを生成
    const sessionId = `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`Dify API リクエスト開始 (セッションID: ${sessionId})`);

    try {
      // AbortControllerの設定（タイムアウト用）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45秒でタイムアウト

      // API URLを環境変数から取得するか、デフォルト値を使用
      const apiUrl = process.env.REACT_APP_DIFY_API_URL || 'https://api.dify.ai/v1/chat-messages';
      console.log('使用するAPI URL:', apiUrl);

      const apiKey = process.env.REACT_APP_DIFY_API_KEY || 'app-sIkEDjFqaRrWwmbZAkIIwfZO';
      console.log('APIキー (最初の10文字):', apiKey.substring(0, 10) + '...');

      // リクエストボディの構築
      const requestBody = {
        inputs: {
          zodiac: zodiacSign,
          mbti: mbtiType,
          gender: gender
        },
        query: "私のMBTIタイプと星座と性別から、恋愛、仕事、健康、お金についての今後の占いをしてください。必ず全ての項目について「【恋愛】」「【仕事】」「【健康】」「【お金】」の見出しをつけて回答してください。",
        response_mode: "blocking",
        user: sessionId
      };

      // APIエンドポイントがworkflows/runの場合はリクエスト形式を調整
      if (apiUrl.includes('/workflows/run')) {
        requestBody.inputs = {
          zodiac: zodiacSign,
          mbti: mbtiType,
          gender: gender
        };
        // workflows APIでは不要なフィールドを削除
        delete requestBody.query;
        delete requestBody.response_mode;
      }

      console.log('リクエストボディ:', JSON.stringify(requestBody));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      // タイムアウトタイマーをクリア
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Dify API エラー (${response.status}): ${errorText}`);
        throw new Error(`API応答エラー (${response.status}): サーバーからのエラーレスポンス`);
      }

      const data = await response.json();
      console.log('Dify API response:', data);
      console.log('Dify API response型:', typeof data);
      console.log('Dify API responseキー:', Object.keys(data));

      // データを直接セット - DifyResultScreenコンポーネントで処理
      console.log('応答データをそのまま渡します');
      setDifyResponse(data);
      setLoading(false);
      setStep(4);
    } catch (error) {
      console.error('Dify API リクエストエラー:', error);
      setLoading(false);
      alert(`エラーが発生しました: ${error.message}`);
      // 診断結果画面に戻る
      setStep(3);
    }
  };

  // レスポンスデータが有効かどうかを確認する関数
  const hasValidContent = (data) => {
    // データがオブジェクトでない場合は無効
    if (!data || typeof data !== 'object') {
      console.log('hasValidContent: データがオブジェクトではありません');
      return false;
    }

    // 各カテゴリの少なくとも1つに意味のあるコンテンツがあればOK
    const categories = ['恋愛', '仕事', '健康', 'お金'];

    // 各カテゴリのチェックとデバッグログ
    const validCategories = categories.filter(category => {
      const content = data[category];
      const isValid = content &&
                      typeof content === 'string' &&
                      content.trim().length > 5; // 最小限の長さを5文字に緩和

      console.log(`カテゴリ「${category}」の内容: ${isValid ? '有効' : '無効'} (${content ? content.length : 0}文字)`);
      return isValid;
    });

    // 有効なカテゴリが1つ以上あればデータは有効と判断
    const isValid = validCategories.length > 0;
    console.log(`有効なカテゴリ数: ${validCategories.length}`);
    return isValid;
  };

  // テストをリセットする
  const resetTest = () => {
    // 完全にステートをリセット
    setStep(1);
    setCurrentQuestion(0);
    setScores({
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    });
    setMbtiType('');
    setZodiacSign('');
    setLoading(false);
    setDifyResponse(null);
    setBirthdate({
      year: new Date().getFullYear() - 20,
      month: 1,
      day: 1
    });
    setGender('');
  };

  // 結果画面への遷移
  const goToResults = () => {
    if (difyResponse) {
      navigate('/result', {
        state: {
          difyResponse,
          mbtiType,
          zodiacSign,
          gender
        }
      });
    }
  };

  // step 4の場合（結果表示）
  useEffect(() => {
    if (step === 4 && difyResponse) {
      goToResults();
    }
  }, [step, difyResponse]);

  // 各ステップに基づいて表示するコンポーネントを切り替え
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <InitialScreen
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            gender={gender}
            setGender={setGender}
            onStartDiagnosis={handleStartDiagnosis}
          />
        );

      case 2:
        return (
          <QuestionScreen
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        );

      case 3:
        return (
          <ResultScreen
            zodiacSign={zodiacSign}
            mbtiType={mbtiType}
            typeDescription={getTypeDescription(mbtiType)}
            scores={scores}
            loading={loading}
            onSendToDify={sendToDify}
            onReset={resetTest}
          />
        );

      case 4:
        return (
          <DifyResultScreen
            zodiacSign={zodiacSign}
            mbtiType={mbtiType}
            gender={gender}
            difyResponse={difyResponse}
            onReset={resetTest}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
      {renderStep()}
    </div>
  );
};

export default MBTITest;