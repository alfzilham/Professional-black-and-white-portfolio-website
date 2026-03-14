(() => {
    /* ── Shaders ── */
    const VERT = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

    const FRAG = `
    precision highp float;
    uniform float iTime;
    uniform vec3  iResolution;
    uniform vec3  uColor;
    uniform float uAmplitude;
    uniform float uDistance;
    uniform vec2  uMouse;

    #define PI 3.1415926538
    const int   u_line_count = 40;
    const float u_line_width = 7.0;
    const float u_line_blur  = 10.0;

    float Perlin2D(vec2 P) {
      vec2 Pi = floor(P);
      vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
      vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
      Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
      Pt += vec2(26.0, 161.0).xyxy;
      Pt *= Pt;
      Pt = Pt.xzxz * Pt.yyww;
      vec4 hash_x = fract(Pt * (1.0 / 951.135664));
      vec4 hash_y = fract(Pt * (1.0 / 642.949883));
      vec4 grad_x = hash_x - 0.49999;
      vec4 grad_y = hash_y - 0.49999;
      vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
          * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
      grad_results *= 1.4142135623730950;
      vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
                 * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
      vec4 blend2 = vec4(blend, vec2(1.0 - blend));
      return dot(grad_results, blend2.zxzx * blend2.wwyy);
    }

    float pixel(float count, vec2 res) {
      return (1.0 / max(res.x, res.y)) * count;
    }

    float lineFn(vec2 st, float width, float perc, float offset,
                 vec2 mouse, float time, float amplitude, float distance) {
      float split_point   = 0.1 + perc * 0.4;
      float amplitude_normal   = smoothstep(split_point, 0.7, st.x);
      float finalAmplitude     = amplitude_normal * 0.5 * amplitude
                                 * (1.0 + (mouse.y - 0.5) * 0.2);
      float time_scaled = time / 10.0 + (mouse.x - 0.5);
      float blur        = smoothstep(split_point, split_point + 0.05, st.x) * perc;
      float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc)        * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
      );
      float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;
      float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y, st.y
      );
      float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
      );
      return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0, 1.0
      );
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      float line_strength = 1.0;
      for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
          uv,
          u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
          p, PI * p, uMouse, iTime, uAmplitude, uDistance
        ));
      }
      float c = 1.0 - line_strength;
      gl_FragColor = vec4(uColor * c, c);
    }
  `;

    /* ── Setup ── */
    const wrap = document.getElementById('threads-canvas-wrap');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'iTime');
    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uColor = gl.getUniformLocation(prog, 'uColor');
    const uAmplitude = gl.getUniformLocation(prog, 'uAmplitude');
    const uDistance = gl.getUniformLocation(prog, 'uDistance');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');

    /* ── Fixed settings ── */
    const AMPLITUDE = 2.5;   // 50% of max 5
    const DISTANCE = 0.0;
    const COLOR = [1, 1, 1];

    /* ── Resize ── */
    function resize() {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── Mouse (tracked on hero only) ── */
    let cur = [0.5, 0.5], tgt = [0.5, 0.5];
    const hero = document.getElementById('hero');
    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        tgt = [
            (e.clientX - r.left) / r.width,
            1 - (e.clientY - r.top) / r.height
        ];
    });
    hero.addEventListener('mouseleave', () => { tgt = [0.5, 0.5]; });

    /* ── Render loop ── */
    function frame(t) {
        requestAnimationFrame(frame);
        const k = 0.05;
        cur[0] += k * (tgt[0] - cur[0]);
        cur[1] += k * (tgt[1] - cur[1]);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, t * 0.001);
        gl.uniform3f(uRes, canvas.width, canvas.height, canvas.width / canvas.height);
        gl.uniform3f(uColor, ...COLOR);
        gl.uniform1f(uAmplitude, AMPLITUDE);
        gl.uniform1f(uDistance, DISTANCE);
        gl.uniform2f(uMouse, cur[0], cur[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(frame);
})();